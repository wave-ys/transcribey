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
    [HttpGet]
    public async Task<ActionResult<Media>> GetMedia(long id)
    {
        var media = await dataContext.Medias.SingleOrDefaultAsync(m => m.Id == id);
        if (media == null)
            return NotFound();
        return media;
    }

    [HttpPost("upload")]
    public async Task<ActionResult<Media>> StartTranscribeUploadFile([FromForm] TranscribeOptionsDto options)
    {
        var extension = options.File.FileName.Split('.')[^1];
        var storePath = Guid.NewGuid() + "." + extension;
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