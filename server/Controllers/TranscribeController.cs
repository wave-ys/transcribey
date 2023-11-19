using Microsoft.AspNetCore.Mvc;

namespace Transcribey.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TranscribeController
{
    [HttpPost("upload")]
    public async Task StartTranscribeUploadFile([FromForm] TranscribeOptionsDto options)
    {
        await using var stream = new FileStream("/Users/heraclius/tmp.wav", FileMode.Create);
        await options.File.CopyToAsync(stream);
        Console.WriteLine(options.Language);
        Console.WriteLine(options.Model);
    }
}

public record TranscribeOptionsDto
{
    public IFormFile File { get; set; } = default!;
    public string Model { get; set; } = "";
    public string Language { get; set; } = "";
}