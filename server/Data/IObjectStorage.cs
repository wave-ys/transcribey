namespace Transcribey.Data;

public interface IObjectStorage
{
    Task StoreMedia(string filePath, string storePath, long fileSize, string contentType);
    Task StoreThumbnail(string filePath, string storePath);
    Task<Stream> GetFile(string filePath);
    Task RemoveFiles(List<string> paths);
}