using System.Text;
using System.Text.Json;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using Transcribey.Models;

namespace Transcribey.Data;

public static class UnroutableMessageConsumer
{
    public const string AlternativeExchange = "unroutable-transcribe-requests";

    public static void UseUnroutableMessageConsumer(this WebApplication app)
    {
        var connection = app.Services.GetRequiredService<IConnection>();
        var channel = connection.CreateModel();
        channel.ExchangeDeclare(AlternativeExchange, ExchangeType.Headers);

        var que = channel.QueueDeclare();
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
            dataContext.Attach(media);
            media.Failed = true;
            media.FailedReason = MediaFailedReason.Unroutable;
            dataContext.Medias.Update(media);
            await dataContext.SaveChangesAsync();
        };

        channel.BasicConsume(que.QueueName, false, consumer);
    }
}