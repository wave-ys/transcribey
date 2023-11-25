using System.Net.Mime;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.EntityFrameworkCore;
using Transcribey.Data;

namespace Transcribey.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ResourceController(IObjectStorage objectStorage, DataContext dataContext) : ControllerBase
{
    [HttpGet("thumbnail/{mediaId}")]
    public async Task<ActionResult> GetThumbnail(long mediaId)
    {
        var media = await dataContext.Medias.SingleOrDefaultAsync(m => m.Id == mediaId);
        if (media == null)
            return NotFound();
        if (string.IsNullOrEmpty(media.ThumbnailPath))
            return NoContent();
        var stream = await objectStorage.GetFile(media.ThumbnailPath);
        return File(stream, MediaTypeNames.Image.Png);
    }

    [HttpGet("media/{mediaId}")]
    public async Task<ActionResult> GetMedia(long mediaId)
    {
        var media = await dataContext.Medias.SingleOrDefaultAsync(m => m.Id == mediaId);
        if (media == null)
            return NotFound();
        if (string.IsNullOrEmpty(media.StorePath))
            return NoContent();
        var stream = await objectStorage.GetFile(media.StorePath);
        new FileExtensionContentTypeProvider().TryGetContentType(media.StorePath, out var contentType);
        return File(stream, contentType!);
    }
}