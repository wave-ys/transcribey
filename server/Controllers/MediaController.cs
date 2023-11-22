using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.EntityFrameworkCore;
using Transcribey.Data;
using Transcribey.Models;

namespace Transcribey.Controllers;

[Route("api/[controller]")]
[ApiController]
public class MediaController
    (IObjectStorage objectStorage, DataContext dataContext, IMessageProducer messageProducer) : ControllerBase
{
    [HttpGet("{id}")]
    public async Task<ActionResult<MediaDto>> GetMedia(long id)
    {
        var media = await dataContext.Medias.SingleOrDefaultAsync(m => m.Id == id);
        if (media == null)
            return NotFound();
        return new MediaDto(media);
    }

    [HttpGet]
    public async Task<ActionResult<List<MediaDto>>> GetMediaList(
        [FromQuery] long workspace,
        [FromQuery] string category,
        [FromQuery] bool deleted
    )
    {
        var queryable = dataContext.Medias
            .Where(m => m.WorkspaceId == workspace && m.Deleted == deleted);
        if (category != "all")
            queryable = queryable.Where(m => m.FileType == category);
        var medias = await queryable
            .ToListAsync();
        return medias.ConvertAll(m => new MediaDto(m));
    }


    [HttpPost("upload")]
    public async Task<ActionResult<MediaDto>> StartTranscribeUploadFile([FromForm] TranscribeOptionsDto options)
    {
        var extension = options.File.FileName.Split('.')[^1];
        var storePath = "/media/" + Guid.NewGuid() + "." + extension;
        if (!new FileExtensionContentTypeProvider().TryGetContentType(options.File.FileName, out var contentType))
            return BadRequest();
        if (!contentType.StartsWith("audio") && !contentType.StartsWith("video"))
            return BadRequest();
        if (await dataContext.Workspaces.SingleOrDefaultAsync(w => w.Id == options.WorkspaceId) == null)
            return BadRequest();

        var media = new Media
        {
            StorePath = storePath,
            FileName = options.File.FileName,
            FileType = MediaFileType.Detecting,
            Model = options.Model,
            Language = options.Language,
            Deleted = false,
            CreatedTime = DateTime.UtcNow,
            WorkspaceId = options.WorkspaceId
        };
        await objectStorage.StoreMedia(options.File.OpenReadStream(), storePath, options.File.Length, contentType);
        dataContext.Medias.Add(media);
        await dataContext.SaveChangesAsync();

        messageProducer.PublishTranscribeTask(media);
        media.Status = MediaStatus.Published;
        await dataContext.SaveChangesAsync();

        return CreatedAtAction("GetMedia", new { id = media.Id }, media);
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

    public string FileName { get; set; } = media.FileName;

    public string Model { get; set; } = media.Model;
    public string Language { get; set; } = media.Language;
    public string FileType { get; set; } = media.FileType;


    public string Status { get; set; } = media.Status;
    public bool Failed { get; set; } = media.Failed;
    public string FailedReason { get; set; } = media.FailedReason;

    public bool Deleted { get; set; } = media.Deleted;
    public DateTime CreatedTime { get; set; } = media.CreatedTime;

    public long WorkspaceId { get; set; } = media.WorkspaceId;
}