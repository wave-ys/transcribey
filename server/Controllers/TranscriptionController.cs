using System.Net;
using System.Net.Mime;
using System.Net.WebSockets;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using Transcribey.Data;
using Transcribey.Models;

namespace Transcribey.Controllers;

[Route("[controller]")]
[ApiController]
public class TranscriptionController(IObjectStorage objectStorage, DataContext dataContext, IModel channel)
    : ControllerBase
{
    public const string TranscribeProgressExchange = "transcribe-progresses";

    [HttpGet("{mediaId}")]
    public async Task<ActionResult> GetTranscription(long mediaId)
    {
        var media = await dataContext.Medias.SingleOrDefaultAsync(m => m.Id == mediaId);
        if (media == null)
            return NotFound();
        if (string.IsNullOrEmpty(media.ResultPath))
            return NoContent();

        var outputPath = Path.GetTempFileName();
        await objectStorage.GetFile(media.ResultPath, outputPath);
        var stream = new FileStream(outputPath, FileMode.Open, FileAccess.Read, FileShare.None, 4096,
            FileOptions.DeleteOnClose);
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

        using var stream = new MemoryStream();
        await Request.Body.CopyToAsync(stream);

        var transcriptions = JsonSerializer.Deserialize<TranscribeProgressSegmentDto[]>(
            Encoding.UTF8.GetString(stream.ToArray()),
            new JsonSerializerOptions(JsonSerializerDefaults.Web));
        if (transcriptions == null)
            return BadRequest();

        var text = string.Join("", transcriptions.Select(item => item.Text));
        var preface = text[..int.Min(text.Length, 100)];
        if (preface != media.Preface)
        {
            media.Preface = preface;
            dataContext.Medias.Update(media);
            await dataContext.SaveChangesAsync();
        }

        stream.Seek(0, SeekOrigin.Begin);
        await objectStorage.SaveFile(media.ResultPath, stream, Request.ContentLength.Value);
        return Ok();
    }

    [HttpGet("{mediaId}/ws")]
    public async Task SubscribeTranscribing(long mediaId)
    {
        if (!HttpContext.WebSockets.IsWebSocketRequest)
        {
            HttpContext.Response.StatusCode = (int)HttpStatusCode.BadRequest;
            return;
        }

        var media = await dataContext.Medias.SingleOrDefaultAsync(m => m.Id == mediaId);
        if (media == null)
        {
            HttpContext.Response.StatusCode = (int)HttpStatusCode.NotFound;
            return;
        }

        if (media.Status == MediaStatus.Completed)
        {
            HttpContext.Response.StatusCode = (int)HttpStatusCode.AlreadyReported;
            return;
        }

        var webSocket = await HttpContext.WebSockets.AcceptWebSocketAsync();
        var task = new TaskCompletionSource();

        var queue = channel.QueueDeclare(exclusive: false);
        channel.QueueBind(queue.QueueName, TranscribeProgressExchange, mediaId.ToString());

        var consumer = new AsyncEventingBasicConsumer(channel);
        var consumerTag = "";
        var firstMessage = true;
        consumer.Received += async (sender, e) =>
        {
            var body = Encoding.UTF8.GetString(e.Body.ToArray());
            var message =
                JsonSerializer.Deserialize<TranscribeProgressDto>(body,
                    new JsonSerializerOptions(JsonSerializerDefaults.Web));
            if (message == null)
                return;

            if (message.Progress == 0 && message.Total == 0)
            {
                await webSocket.SendAsync("complete"u8.ToArray(), WebSocketMessageType.Text, true,
                    CancellationToken.None);
                channel.BasicAck(e.DeliveryTag, true);
                task.SetResult();
                return;
            }

            var response = new TranscribeProgressResponseDto
            {
                Total = message.Total,
                Progress = message.Progress,
                Segments = firstMessage ? message.Segments : message.Current
            };
            firstMessage = false;
            await webSocket.SendAsync(
                Encoding.UTF8.GetBytes(JsonSerializer.Serialize(response,
                    new JsonSerializerOptions(JsonSerializerDefaults.Web))),
                WebSocketMessageType.Text, true, CancellationToken.None);

            channel.BasicAck(e.DeliveryTag, true);
        };

        consumerTag = channel.BasicConsume(queue.QueueName, false, consumer);
        await Task.WhenAny(task.Task, ReceiveHeartbeat(webSocket));
        if (webSocket.State == WebSocketState.Open)
            await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, null, CancellationToken.None);
        channel.BasicCancel(consumerTag);
        channel.Close();
    }

    private async Task ReceiveHeartbeat(WebSocket webSocket)
    {
        var buffer = new byte[1024];
        while (webSocket.State == WebSocketState.Open)
        {
            var cts = new CancellationTokenSource();
            cts.CancelAfter(TimeSpan.FromSeconds(30));
            try
            {
                var result = await webSocket.ReceiveAsync(new ArraySegment<byte>(buffer), cts.Token);
                if (result.CloseStatus.HasValue)
                    return;
                await webSocket.SendAsync("pong"u8.ToArray(), WebSocketMessageType.Text, true, CancellationToken.None);
            }
            catch (OperationCanceledException e)
            {
                return;
            }
        }
    }
}

public class TranscribeProgressSegmentDto
{
    public double Start { get; set; }
    public double End { get; set; }
    public string Text { get; set; } = default!;
}

public class TranscribeProgressDto
{
    public long Total { get; set; }
    public long Progress { get; set; }
    public List<TranscribeProgressSegmentDto> Segments { get; set; } = default!;
    public List<TranscribeProgressSegmentDto> Current { get; set; } = default!;
}

public class TranscribeProgressResponseDto
{
    public long Total { get; set; }
    public long Progress { get; set; }
    public List<TranscribeProgressSegmentDto> Segments { get; set; } = default!;
}