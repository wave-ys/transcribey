namespace Transcribey.Data;

public interface IObjectStorage
{
    Task StoreMedia(string filePath, string storePath, long fileSize, string contentType);
    Task StoreThumbnail(string filePath, string storePath);
    Task<Stream> GetFile(string filePath);
    Task GetFile(string filePath, string outputPath);
    Task SaveFile(string filePath, Stream reader, long length);
    Task GetPartialFile(string filePath, long from, long to, Stream writer);
    Task<long> GetFileSize(string filePath);
    Task RemoveFiles(List<string> paths);
}