using Microsoft.AspNetCore.Mvc;
using Transcribey.Data;

namespace Transcribey.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TranscribeController(IObjectStorage objectStorage)
{
    [HttpPost("upload")]
    public async Task StartTranscribeUploadFile([FromForm] TranscribeOptionsDto options)
    {
        var strings = options.File.FileName.Split('.');
        await objectStorage.StoreMedia(options.File.OpenReadStream(), strings[^1], options.File.Length);
    }
}

public record TranscribeOptionsDto
{
    public IFormFile File { get; set; } = default!;
    public string Model { get; set; } = "";
    public string Language { get; set; } = "";
}