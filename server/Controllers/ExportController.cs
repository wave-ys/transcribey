using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Transcribey.Data;
using Transcribey.Utils;

namespace Transcribey.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ExportController(DataContext dataContext, IObjectStorage objectStorage) : ControllerBase
{
    [HttpPost("soft/{id}")]
    public async Task<ActionResult> ExportWithSoftSubtitles(long id)
    {
        var subtitles = await Request.Body.ReadAsStringAsync();

        var media = await dataContext.Medias.SingleOrDefaultAsync(m => m.Id == id);
        if (media == null || string.IsNullOrEmpty(media.StorePath))
            return NotFound();

        var extension = media.FileName.Split('.')[^1];
        var videoPath = Path.GetTempFileName() + "." + extension;
        var outputPath = Path.GetTempFileName() + "." + extension;
        var subtitlesPath = Path.GetTempFileName() + ".srt";

        try
        {
            await objectStorage.GetFile(media.StorePath, videoPath);
            await using var subtitlesStream = new FileStream(subtitlesPath, FileMode.Create);
            await subtitlesStream.WriteAsync(Encoding.UTF8.GetBytes(subtitles));
            await subtitlesStream.FlushAsync();
            await MediaProcessor.EmbedSoftSubtitles(videoPath, subtitlesPath, outputPath);

            var memoryStream = new MemoryStream();
            await using var videoStream = new FileStream(outputPath, FileMode.Open);
            await videoStream.CopyToAsync(memoryStream);
            memoryStream.Seek(0, SeekOrigin.Begin);
            return File(memoryStream, media.ContentType, media.FileName);
        }
        finally
        {
            System.IO.File.Delete(videoPath);
            System.IO.File.Delete(subtitlesPath);
            System.IO.File.Delete(outputPath);
        }
    }
}