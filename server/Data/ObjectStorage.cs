using System.Net.Mime;
using Minio;
using Minio.DataModel.Args;

namespace Transcribey.Data;

public class ObjectStorage(IConfiguration configuration, IMinioClient minioClient) : IObjectStorage
{
    private readonly string _bucketName = configuration.GetValue<string>("MinIO:BucketName") ?? "transcribey";

    public async Task StoreMedia(string filePath, string storePath, long fileSize, string contentType)
    {
        if (!await minioClient.BucketExistsAsync(new BucketExistsArgs().WithBucket(_bucketName)))
            await minioClient.MakeBucketAsync(new MakeBucketArgs().WithBucket(_bucketName));
        await minioClient.PutObjectAsync(
            new PutObjectArgs()
                .WithBucket(_bucketName)
                .WithFileName(filePath)
                .WithObjectSize(fileSize)
                .WithContentType(contentType)
                .WithObject(storePath)
        );
    }

    public async Task StoreThumbnail(string filePath, string storePath)
    {
        if (!await minioClient.BucketExistsAsync(new BucketExistsArgs().WithBucket(_bucketName)))
            await minioClient.MakeBucketAsync(new MakeBucketArgs().WithBucket(_bucketName));
        await minioClient.PutObjectAsync(
            new PutObjectArgs()
                .WithBucket(_bucketName)
                .WithFileName(filePath)
                .WithContentType(MediaTypeNames.Image.Png)
                .WithObject(storePath)
        );
    }

    public async Task<Stream> GetFile(string filePath)
    {
        var task = new TaskCompletionSource<Stream>();
        await minioClient.GetObjectAsync(
            new GetObjectArgs()
                .WithBucket(_bucketName)
                .WithObject(filePath)
                .WithCallbackStream(stream =>
                {
                    Stream memoryStream = new MemoryStream();
                    stream.CopyTo(memoryStream);
                    memoryStream.Seek(0, SeekOrigin.Begin);
                    task.SetResult(memoryStream);
                })
        );
        return await task.Task;
    }

    public async Task GetFile(string filePath, string outputPath)
    {
        await minioClient.GetObjectAsync(
            new GetObjectArgs()
                .WithBucket(_bucketName)
                .WithObject(filePath)
                .WithFile(outputPath)
        );
    }

    public async Task GetFile(string filePath, Stream outputStream)
    {
        await minioClient.GetObjectAsync(
            new GetObjectArgs()
                .WithBucket(_bucketName)
                .WithObject(filePath)
                .WithCallbackStream((stream, token) => stream.CopyToAsync(outputStream, token))
        );
    }

    public async Task RemoveFiles(List<string> paths)
    {
        await minioClient.RemoveObjectsAsync(
            new RemoveObjectsArgs()
                .WithBucket(_bucketName)
                .WithObjects(paths)
        );
    }

    public async Task<long> GetFileSize(string filePath)
    {
        var stat = await minioClient.StatObjectAsync(
            new StatObjectArgs()
                .WithBucket(_bucketName)
                .WithObject(filePath)
        );
        return stat.Size;
    }

    public async Task GetPartialFile(string filePath, long from, long to, Stream writer)
    {
        var task = new TaskCompletionSource<Stream>();
        await minioClient.GetObjectAsync(
            new GetObjectArgs()
                .WithBucket(_bucketName)
                .WithObject(filePath)
                .WithOffsetAndLength(from, to - from + 1)
                .WithCallbackStream(stream =>
                {
                    var memoryStream = new MemoryStream();
                    stream.CopyTo(memoryStream);
                    memoryStream.Seek(0, SeekOrigin.Begin);
                    task.SetResult(memoryStream);
                })
        );
        var stream = await task.Task;
        await stream.CopyToAsync(writer);
    }

    public async Task SaveFile(string filePath, Stream reader, long length)
    {
        await minioClient.PutObjectAsync(
            new PutObjectArgs()
                .WithBucket(_bucketName)
                .WithObject(filePath)
                .WithStreamData(reader)
                .WithObjectSize(length)
        );
    }
}