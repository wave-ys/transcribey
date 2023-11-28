using System.Net.Mime;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Transcribey.Data;

namespace Transcribey.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TranscriptionController(IObjectStorage objectStorage, DataContext dataContext) : ControllerBase
{
    [HttpGet("{mediaId}")]
    public async Task<ActionResult> GetTranscription(long mediaId)
    {
        var media = await dataContext.Medias.SingleOrDefaultAsync(m => m.Id == mediaId);
        if (media == null)
            return NotFound();
        if (string.IsNullOrEmpty(media.ResultPath))
            return NoContent();

        var stream = await objectStorage.GetFile(media.ResultPath);
        return File(stream, MediaTypeNames.Application.Json);
    }

    [HttpPut("{mediaId}")]
    public async Task<ActionResult> SaveTranscription(long mediaId)
    {
        if (Request.ContentLength == null)
            return BadRequest();
        var media = await dataContext.Medias.SingleOrDefaultAsync(m => m.Id == mediaId);
        if (string.IsNullOrEmpty(media?.ResultPath))
            return NotFound();
        await objectStorage.SaveFile(media.ResultPath, Request.Body, Request.ContentLength.Value);
        return Ok();
    }
}