using System.Net.Mime;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Transcribey.Data;

namespace Transcribey.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ThumbnailController(IObjectStorage objectStorage, DataContext dataContext) : ControllerBase
{
    [HttpGet("{mediaId}")]
    public async Task<ActionResult> GetThumbnail(long mediaId)
    {
        var media = await dataContext.Medias.SingleOrDefaultAsync(m => m.Id == mediaId);
        if (media == null)
            return NotFound();
        if (string.IsNullOrEmpty(media.ThumbnailPath))
            return NoContent();
        var stream = await objectStorage.GetThumbnail(media.ThumbnailPath);
        return File(stream, MediaTypeNames.Image.Png);
    }
}