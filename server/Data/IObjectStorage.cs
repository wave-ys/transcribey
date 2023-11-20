namespace Transcribey.Data;

public interface IObjectStorage
{
    Task StoreMedia(Stream fileStream, string storePath, long fileSize, string contentType);
}