using Transcribey.Models;

namespace Transcribey.Data;

public interface IMessageProducer
{
    void PublishTranscribeTask(Media media);
}