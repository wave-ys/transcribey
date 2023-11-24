import json
import os
import tempfile
import uuid

import pika

import database_context
from object_storage import ObjectStorage
from transcriber import Transcriber

HANDLE_TRANSCRIBE_QUEUE = 'handle-transcribe-queue'
TRANSCRIBE_REQUEST_EXCHANGE = 'transcribe-requests'


class MessageConsumer:
    def __init__(self, object_storage: ObjectStorage, mq_connection: pika.BlockingConnection,
                 db_context: database_context.DatabaseContext,
                 transcriber: Transcriber, supported_models: [str], use_gpu: bool):
        self.object_storage = object_storage
        self.mq_connection = mq_connection
        self.db_context = db_context
        self.transcriber = transcriber
        self.supported_models = supported_models
        self.use_gpu = use_gpu

    def start_consume(self, ):
        channel = self.mq_connection.channel()
        channel.basic_qos(prefetch_count=1)

        for model in self.supported_models:
            queue_name = HANDLE_TRANSCRIBE_QUEUE + '-' + model + '-' + ('gpu' if self.use_gpu else 'cpu')
            channel.queue_declare(queue_name, exclusive=False, auto_delete=True)
            channel.queue_bind(queue_name, TRANSCRIBE_REQUEST_EXCHANGE, routing_key='#', arguments={
                'x-match': 'all',
                'model': model,
                'use_gpu': self.use_gpu
            })

            channel.basic_consume(queue_name,
                                  auto_ack=False,
                                  on_message_callback=self.__callback)

        channel.start_consuming()

    def __callback(self,
                   ch: pika.adapters.blocking_connection.BlockingChannel,
                   method: pika.spec.Basic.Deliver,
                   properties: pika.spec.BasicProperties,
                   body: bytes):
        media = json.loads(body)

        media_file = tempfile.NamedTemporaryFile(delete=False)
        media_file.close()

        thumbnail_file = tempfile.NamedTemporaryFile(delete=False, suffix='.png')
        thumbnail_file.close()

        try:
            self.object_storage.download_media(media, media_file.name)
            self.db_context.mark_start_transcribe(media["Id"])
            self.db_context.commit()

            data = self.transcriber.transcribe(media, media_file.name)
            result_path = '/transcription/' + str(uuid.uuid4()) + '.json'
            self.object_storage.store_result(json.dumps(data), result_path)

            self.db_context.mark_complete_transcribe(media["Id"], result_path)
            self.db_context.commit()
            ch.basic_ack(delivery_tag=method.delivery_tag)
        finally:
            os.unlink(media_file.name)
            os.unlink(thumbnail_file.name)
