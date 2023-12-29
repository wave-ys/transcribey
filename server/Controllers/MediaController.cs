using System.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.EntityFrameworkCore;
using Transcribey.Data;
using Transcribey.Models;
using Transcribey.Utils;

namespace Transcribey.Controllers;

[Route("[controller]")]
[ApiController]
public class MediaController(IObjectStorage objectStorage, DataContext dataContext, IMessageProducer messageProducer)
    : ControllerBase
{
    [HttpGet("{id}")]
    [Authorize]
    public async Task<ActionResult<MediaDto>> GetMedia(long id)
    {
        var user = await HttpContext.GetUserAsync();
        var media = await dataContext.Medias.SingleOrDefaultAsync(m =>
            m.Id == id && !m.Deleted && m.Workspace.AppUserId == user!.Id);
        if (media == null)
            return NotFound();
        return new MediaDto(media);
    }

    [HttpGet]
    [Authorize]
    public async Task<ActionResult<List<MediaDto>>> GetMediaList(
        [FromQuery] long workspace,
        [FromQuery] string category,
        [FromQuery] bool deleted
    )
    {
        var user = await HttpContext.GetUserAsync();
        var queryable = dataContext.Medias
            .Where(m => m.WorkspaceId == workspace && m.Deleted == deleted && m.Workspace.AppUserId == user!.Id);
        if (category != "all")
            queryable = queryable.Where(m => m.FileType == category);
        var medias = await queryable
            .ToListAsync();
        return medias.ConvertAll(m => new MediaDto(m));
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<ActionResult> DeleteMedia(long id, [FromQuery] bool permanent)
    {
        var user = await HttpContext.GetUserAsync();
        if (!permanent)
        {
            await dataContext.Medias.Where(m => m.Id == id && m.Workspace.AppUserId == user!.Id)
                .ExecuteUpdateAsync(setter => setter
                    .SetProperty(m => m.Deleted, true));
        }
        else
        {
            // https://stackoverflow.com/a/18134569
            await using var transaction =
                await dataContext.Database.BeginTransactionAsync(IsolationLevel.RepeatableRead);
            try
            {
                var media = await dataContext.Medias.AsNoTracking()
                    .SingleOrDefaultAsync(m => m.Id == id && m.Workspace.AppUserId == user!.Id);
                if (media == null)
                    return NotFound();
                await dataContext.Medias.Where(m => m.Id == id && m.Workspace.AppUserId == user!.Id)
                    .ExecuteDeleteAsync();
                await objectStorage.RemoveFiles(new List<string>
                        { media.ThumbnailPath, media.ResultPath, media.StorePath }
                    .Where(s => !string.IsNullOrEmpty(s)).ToList());
                await transaction.CommitAsync();
            }
            catch (Exception)
            {
                await transaction.RollbackAsync();
            }
        }

        return NoContent();
    }

    [HttpPut("put_back/{id}")]
    [Authorize]
    public async Task<ActionResult> PutBackMedia(long id)
    {
        var user = await HttpContext.GetUserAsync();
        await dataContext.Medias.Where(m => m.Id == id && m.Workspace.AppUserId == user!.Id)
            .ExecuteUpdateAsync(setter => setter
                .SetProperty(m => m.Deleted, false));
        return NoContent();
    }


    [HttpPost("upload")]
    [Authorize]
    public async Task<ActionResult<MediaDto>> StartTranscribeUploadFile([FromForm] TranscribeOptionsDto options)
    {
        var user = await HttpContext.GetUserAsync();

        var filePath = Path.GetTempFileName();
        var tempThumbnailFilePath = "";

        try
        {
            var extension = options.File.FileName.Split('.')[^1];
            var storePath = "/media/" + Guid.NewGuid() + "." + extension;
            if (!new FileExtensionContentTypeProvider().TryGetContentType(options.File.FileName, out var contentType))
                return BadRequest();
            if (!contentType.StartsWith("audio") && !contentType.StartsWith("video"))
                return BadRequest();
            if (!await dataContext.Workspaces.Where(w => w.Id == options.WorkspaceId && w.AppUserId == user!.Id)
                    .AnyAsync())
                return BadRequest();

            var fileStream = new FileStream(filePath, FileMode.Create);
            await options.File.CopyToAsync(fileStream);
            fileStream.Close();

            var fileType = await MediaProcessor.DetectFileType(filePath);
            if (fileType == MediaFileType.Error)
                return BadRequest();
            if (!contentType.StartsWith(fileType))
            {
                var split = contentType.Split("/");
                split[0] = fileType;
                contentType = string.Join('/', split);
            }

            var duration = await MediaProcessor.GetDuration(filePath);

            var thumbnailPath = fileType == MediaFileType.Video ? "/thumbnail/" + Guid.NewGuid() + ".png" : "";
            if (fileType == MediaFileType.Video)
            {
                tempThumbnailFilePath = Path.GetTempFileName() + ".png";
                await MediaProcessor.GenerateThumbnail(filePath, tempThumbnailFilePath);
                await objectStorage.StoreThumbnail(tempThumbnailFilePath, thumbnailPath);
            }

            var media = new Media
            {
                StorePath = storePath,
                FileName = options.File.FileName,
                Duration = duration,
                FileType = fileType,
                ContentType = contentType,
                ThumbnailPath = thumbnailPath,
                Model = options.Model,
                Language = options.Language,
                Deleted = false,
                CreatedTime = DateTime.UtcNow,
                WorkspaceId = options.WorkspaceId
            };
            await objectStorage.StoreMedia(filePath, storePath, options.File.Length, contentType);
            dataContext.Medias.Add(media);
            await dataContext.SaveChangesAsync();

            messageProducer.PublishTranscribeTask(media);
            return CreatedAtAction("GetMedia", new { id = media.Id }, media);
        }
        finally
        {
            if (tempThumbnailFilePath != "")
                System.IO.File.Delete(tempThumbnailFilePath);
            if (filePath != "")
                System.IO.File.Delete(filePath);
        }
    }
}

public record TranscribeOptionsDto
{
    public IFormFile File { get; set; } = default!;
    public string Model { get; set; } = "";
    public string Language { get; set; } = "";
    public long WorkspaceId { get; set; }
}

public class MediaDto(Media media)
{
    public long Id { get; set; } = media.Id;
    public string Preface { get; set; } = media.Preface;
    public double Duration { get; set; } = media.Duration;

    public string FileName { get; set; } = media.FileName;

    public string Model { get; set; } = media.Model;
    public string Language { get; set; } = media.Language;
    public string FileType { get; set; } = media.FileType;
    public string ContentType { get; set; } = media.ContentType;

    public string Status { get; set; } = media.Status;
    public bool Failed { get; set; } = media.Failed;
    public string FailedReason { get; set; } = media.FailedReason;

    public bool Deleted { get; set; } = media.Deleted;
    public DateTime CreatedTime { get; set; } = media.CreatedTime;

    public long WorkspaceId { get; set; } = media.WorkspaceId;
}