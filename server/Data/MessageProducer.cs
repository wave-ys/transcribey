using System.Text;
using System.Text.Json;
using RabbitMQ.Client;
using Transcribey.Models;

namespace Transcribey.Data;

public class MessageProducer(IModel channel) : IMessageProducer
{
    private const string TranscribeRequestExchange = "transcribe-requests";

    public void PublishTranscribeTask(Media media)
    {
        channel.ExchangeDeclare(TranscribeRequestExchange, ExchangeType.Headers,
            arguments: new Dictionary<string, object>
            {
                ["alternate-exchange"] = UnroutableMessageConsumer.AlternativeExchange
            });

        var basicProperties = channel.CreateBasicProperties();
        basicProperties.ContentType = "application/json";
        basicProperties.Headers = new Dictionary<string, object>
        {
            ["language"] = media.Language,
            ["model"] = media.Model,
            ["type"] = media.FileType
        };

        channel.BasicPublish(
            TranscribeRequestExchange,
            "transcribe",
            body: Encoding.UTF8.GetBytes(JsonSerializer.Serialize(media)),
            basicProperties: basicProperties);
    }
}