from os import environ as env

import pika
import sqlalchemy
from dotenv import load_dotenv

import database_context
import message_consumer
from object_storage import ObjectStorage
from transcriber import Transcriber


def main():
    load_dotenv()

    mq_connection = pika.BlockingConnection(pika.URLParameters(env['RABBITMQ_URI']))
    db_engine = sqlalchemy.create_engine(env['DATABASE_URI'], echo=True)

    with db_engine.connect() as db_connection:
        db_context = database_context.DatabaseContext(db_connection)
        object_storage = ObjectStorage(
            env['MINIO_ENDPOINT'], env['MINIO_ACCESS_KEY'], env['MINIO_SECRET_KEY'],
            env['MINIO_BUCKET_NAME'], env['MINIO_USE_SSL'] == 'true'
        )

        transcriber = Transcriber(object_storage)

        msg_consumer = message_consumer.MessageConsumer(mq_connection, db_context, transcriber)
        msg_consumer.start_consume()


if __name__ == '__main__':
    main()
