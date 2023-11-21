import io

from minio import Minio


class ObjectStorage:
    def __init__(self, endpoint: str, access_key: str, secret_key: str, bucket_name: str, use_ssl: bool):
        self.bucket_name = bucket_name
        self.client = Minio(endpoint, access_key, secret_key, secure=use_ssl)
        if not self.client.bucket_exists(bucket_name):
            self.client.make_bucket(bucket_name)

    def download_media(self, media, download_path):
        self.client.fget_object(self.bucket_name, media['StorePath'], download_path)

    def store_result(self, text: str, upload_path: str):
        data = text.encode('utf-8')
        # TODO: try leveraging multi-thread to improve speed
        self.client.put_object(self.bucket_name, upload_path, io.BytesIO(data), len(data),
                               content_type='application/json')
