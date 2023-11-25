import json
import logging
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

        logging.info("Message consumer starting consuming.")
        channel.start_consuming()

    def __callback(self,
                   ch: pika.adapters.blocking_connection.BlockingChannel,
                   method: pika.spec.Basic.Deliver,
                   properties: pika.spec.BasicProperties,
                   body: bytes):
        media = json.loads(body)
        logging.info(f"Received message: Id = {media['Id']}, FileName = {media['FileName']}")

        media_file = tempfile.NamedTemporaryFile(delete=False)
        media_file.close()

        thumbnail_file = tempfile.NamedTemporaryFile(delete=False, suffix='.png')
        thumbnail_file.close()

        try:
            self.object_storage.download_media(media, media_file.name)
            logging.info("Downloaded media from minio.")
            self.db_context.mark_start_transcribe(media["Id"])
            self.db_context.commit()
            logging.info("Updated media status to 'transcribing'.")

            logging.info("Starting transcribing.")
            result = self.transcriber.transcribe(media, media_file.name)

            logging.info("Transcribing completed. Saving result.")
            result_path = '/transcription/' + str(uuid.uuid4()) + '.json'
            self.object_storage.store_result(json.dumps(result["data"]), result_path)
            logging.info("Result saved.")

            current_record = self.db_context.fetch_media(media["Id"])
            if current_record is not None:
                self.db_context.mark_complete_transcribe(media["Id"], result_path, result["preface"])
                self.db_context.commit()
                logging.info("Save result path to database.")
            else:
                self.db_context.commit()
                logging.info("The database record has been deleted. Deleting result file in Minio.")
                self.object_storage.delete_file(result_path)
                logging.info("Result deleted.")
            ch.basic_ack(delivery_tag=method.delivery_tag)
            logging.info("Message consumed successfully.")
        finally:
            os.unlink(media_file.name)
            os.unlink(thumbnail_file.name)
