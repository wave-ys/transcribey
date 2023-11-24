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

    public async Task<Stream> GetThumbnail(string thumbnailPath)
    {
        var task = new TaskCompletionSource<Stream>();
        await minioClient.GetObjectAsync(
            new GetObjectArgs()
                .WithBucket(_bucketName)
                .WithObject(thumbnailPath)
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
}