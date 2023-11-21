using System.Text;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using Transcribey.Models;

namespace Transcribey.Data;

public static class UnroutableMessageConsumer
{
    public const string AlternativeExchange = "unroutable-transcribe-requests";
    public const string MarkUnroutableQueue = "mark-unroutable-queue";

    public static void UseUnroutableMessageConsumer(this WebApplication app)
    {
        var connection = app.Services.GetRequiredService<IConnection>();
        var channel = connection.CreateModel();
        channel.ExchangeDeclare(AlternativeExchange, ExchangeType.Headers);

        var que = channel.QueueDeclare(MarkUnroutableQueue, exclusive: false);
        channel.QueueBind(que.QueueName, AlternativeExchange, "#", new Dictionary<string, object>
        {
            ["x-match"] = "all"
        });

        var consumer = new AsyncEventingBasicConsumer(channel);
        consumer.Received += async (sender, e) =>
        {
            var media = JsonSerializer.Deserialize<Media>(Encoding.UTF8.GetString(e.Body.ToArray()));
            if (media == null)
                return;

            await using var scope = app.Services.CreateAsyncScope();
            var dataContext = scope.ServiceProvider.GetRequiredService<DataContext>();

            await dataContext.Medias
                .Where(m => m.Id == media.Id)
                .ExecuteUpdateAsync(setter => setter
                    .SetProperty(m => m.Failed, true)
                    .SetProperty(m => m.FailedReason, MediaFailedReason.Unroutable)
                );
            channel.BasicAck(e.DeliveryTag, false);
        };

        channel.BasicQos(0, 5, false);
        channel.BasicConsume(que.QueueName, false, consumer);
    }
}