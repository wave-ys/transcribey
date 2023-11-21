from os import environ as env

import pika
import sqlalchemy
from dotenv import load_dotenv

import database_context
import message_consumer
from object_storage import ObjectStorage
from transcriber import Transcriber
from message_producer import MessageProducer


def main():
    load_dotenv()

    object_storage = ObjectStorage(
        env['MINIO_ENDPOINT'], env['MINIO_ACCESS_KEY'], env['MINIO_SECRET_KEY'],
        env['MINIO_BUCKET_NAME'], env['MINIO_USE_SSL'] == 'true'
    )

    message_producer = MessageProducer()
    supported_models = env['SUPPORTED_MODELS'].split(',')
    transcriber = Transcriber(object_storage, supported_models, env['USE_GPU'] == 'true', message_producer)

    db_engine = sqlalchemy.create_engine(env['DATABASE_URI'], echo=True)
    with db_engine.connect() as db_connection:
        db_context = database_context.DatabaseContext(db_connection)

        mq_connection = pika.BlockingConnection(pika.URLParameters(env['RABBITMQ_URI']))
        message_producer.init(mq_connection)
        msg_consumer = message_consumer.MessageConsumer(mq_connection, db_context, transcriber, supported_models,
                                                        env['USE_GPU'] == 'true')
        msg_consumer.start_consume()


if __name__ == '__main__':
    main()
