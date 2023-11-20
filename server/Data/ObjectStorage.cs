using Minio;
using Minio.DataModel.Args;

namespace Transcribey.Data;

public class ObjectStorage(IConfiguration configuration, IMinioClient minioClient) : IObjectStorage
{
    private readonly string _bucketName = configuration.GetValue<string>("MinIO:BucketName") ?? "transcribey";

    public async Task StoreMedia(Stream fileStream, string storePath, long fileSize, string contentType)
    {
        if (!await minioClient.BucketExistsAsync(new BucketExistsArgs().WithBucket(_bucketName)))
            await minioClient.MakeBucketAsync(new MakeBucketArgs().WithBucket(_bucketName));
        await minioClient.PutObjectAsync(
            new PutObjectArgs()
                .WithBucket(_bucketName)
                .WithStreamData(fileStream)
                .WithObjectSize(fileSize)
                .WithContentType(contentType)
                .WithObject(storePath)
        );
    }
}