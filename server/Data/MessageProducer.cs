using System.Text;
using System.Text.Json;
using RabbitMQ.Client;
using Transcribey.Models;

namespace Transcribey.Data;

public class MessageProducer(IModel channel) : IMessageProducer
{
    public const string TranscribeRequestExchange = "transcribe-requests";

    public void PublishTranscribeTask(Media media)
    {
        var basicProperties = channel.CreateBasicProperties();
        basicProperties.ContentType = "application/json";
        basicProperties.Headers = new Dictionary<string, object>
        {
            ["model"] = media.Model,
            ["use_gpu"] = false
        };

        channel.BasicPublish(
            TranscribeRequestExchange,
            "transcribe",
            body: Encoding.UTF8.GetBytes(JsonSerializer.Serialize(media)),
            basicProperties: basicProperties);
    }
}

public static class MessageProducerInitializer
{
    public static void UseMessagePublisher(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var channel = scope.ServiceProvider.GetRequiredService<IModel>();
        channel.ExchangeDeclare(MessageProducer.TranscribeRequestExchange, ExchangeType.Headers,
            arguments: new Dictionary<string, object>
            {
                ["alternate-exchange"] = UnroutableMessageConsumer.AlternativeExchange
            });
    }
}