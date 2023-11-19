namespace Transcribey.Data;

public interface IObjectStorage
{
    Task StoreMedia(Stream fileStream, string fileExtension, long fileSize);
}