using System.Text;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;

namespace Transcribey.Data;

public static class UnroutableMessageConsumer
{
    public const string AlternativeExchange = "unroutable-messages";

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
            var bytes = e.Body.ToArray();
            var s = Encoding.UTF8.GetString(bytes);
            Console.WriteLine(s);
            await Task.Yield();
        };

        channel.BasicConsume(que.QueueName, false, consumer);
    }
}