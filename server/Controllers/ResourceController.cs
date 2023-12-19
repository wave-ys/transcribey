using System.Net;
using System.Net.Mime;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Transcribey.Data;
using Transcribey.Utils;

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

    [HttpHead("media/{mediaId}")]
    public async Task<ActionResult> GetMediaHead(long mediaId)
    {
        var media = await dataContext.Medias.SingleOrDefaultAsync(m => m.Id == mediaId);
        if (media == null || string.IsNullOrEmpty(media.StorePath))
            return NotFound();

        var size = await objectStorage.GetFileSize(media.StorePath);
        Response.Headers.AcceptRanges = "bytes";
        Response.Headers.ContentLength = size;
        Response.Headers.ContentType = media.ContentType;

        return Ok();
    }

    [HttpGet("media/{mediaId}")]
    public async Task GetMedia(long mediaId)
    {
        var media = await dataContext.Medias.SingleOrDefaultAsync(m => m.Id == mediaId);
        if (media == null)
        {
            Response.StatusCode = (int)HttpStatusCode.NotFound;
            return;
        }

        if (string.IsNullOrEmpty(media.StorePath))
        {
            Response.StatusCode = (int)HttpStatusCode.NotFound;
            return;
        }

        var contentType = media.ContentType;

        var size = await objectStorage.GetFileSize(media.StorePath);

        Response.Headers.AcceptRanges = "bytes";

        var ranges = RangeRequestUtils.ParseRangeHeader(Request.Headers.Range, size, 32 * 1024 * 1024);
        if (ranges == null || ranges.Count == 0)
        {
            Response.Headers.ContentType = contentType;
            Response.Headers.ContentLength = size;
            Response.Headers.ContentDisposition =
                "attachment; filename*=UTF-8''" + Uri.EscapeDataString(media.FileName);
            Response.StatusCode = (int)HttpStatusCode.OK;
            await objectStorage.GetFile(media.StorePath, Response.Body);
            return;
        }

        Response.StatusCode = (int)HttpStatusCode.PartialContent;

        Response.Headers.ContentType = ranges.Count > 1
            ? $"{MediaTypeNames.Multipart.ByteRanges}; boundary={RangeRequestUtils.PartialBoundary}"
            : contentType;

        if (ranges.Count == 1)
        {
            Response.Headers.ContentRange = $"bytes {ranges.First().From}-{ranges.First().To}/{size}";
            await objectStorage.GetPartialFile(
                media.StorePath,
                ranges.First().From,
                ranges.First().To,
                Response.Body
            );
        }
        else
        {
            foreach (var range in ranges)
            {
                await Response.Body.WriteAsync(Encoding.UTF8.GetBytes($"--{RangeRequestUtils.PartialBoundary}\r\n"));
                await Response.Body.WriteAsync(
                    Encoding.UTF8.GetBytes($"Content-Type: {contentType}\r\n"));
                await Response.Body.WriteAsync(
                    Encoding.UTF8.GetBytes($"Content-Range: bytes {range.From}-{range.To}/{size}\r\n\r\n"));
                await objectStorage.GetPartialFile(media.StorePath, range.From, range.To, Response.Body);
                await Response.Body.WriteAsync("\r\n"u8.ToArray());
            }

            await Response.Body.WriteAsync(Encoding.UTF8.GetBytes($"--{RangeRequestUtils.PartialBoundary}--"));
        }
    }
}