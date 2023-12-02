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

[Route("api/[controller]")]
[ApiController]
public class TranscriptionController
    (IObjectStorage objectStorage, DataContext dataContext, IModel channel) : ControllerBase
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
                await webSocket.CloseAsync(WebSocketCloseStatus.NormalClosure, null, CancellationToken.None);
                channel.BasicAck(e.DeliveryTag, true);
                channel.BasicCancel(consumerTag);
                channel.Close();
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
            await webSocket.SendAsync(Encoding.UTF8.GetBytes(JsonSerializer.Serialize(response)),
                WebSocketMessageType.Text, true, CancellationToken.None);

            channel.BasicAck(e.DeliveryTag, true);
        };
        consumerTag = channel.BasicConsume(queue.QueueName, false, consumer);
        await task.Task;
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