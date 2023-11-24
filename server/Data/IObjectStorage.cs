namespace Transcribey.Data;

public interface IObjectStorage
{
    Task StoreMedia(string filePath, string storePath, long fileSize, string contentType);
    Task StoreThumbnail(string filePath, string storePath);
    Task<Stream> GetThumbnail(string thumbnailPath);
    Task RemoveFiles(List<string> paths);
}