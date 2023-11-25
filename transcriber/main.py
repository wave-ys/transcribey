import logging
from os import environ as env

import pika
import sqlalchemy
from dotenv import load_dotenv

import database_context
import message_consumer
from message_producer import MessageProducer
from object_storage import ObjectStorage
from transcriber import Transcriber


def main():
    logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
    logging.getLogger('sqlalchemy.engine').setLevel(logging.WARNING)
    logging.getLogger("pika").setLevel(logging.WARNING)

    load_dotenv()

    object_storage = ObjectStorage(
        env['MINIO_ENDPOINT'], env['MINIO_ACCESS_KEY'], env['MINIO_SECRET_KEY'],
        env['MINIO_BUCKET_NAME'], env['MINIO_USE_SSL'] == 'true'
    )

    message_producer = MessageProducer()
    supported_models = env['SUPPORTED_MODELS'].split(',')

    transcriber = Transcriber(supported_models, env['USE_GPU'] == 'true', message_producer)

    db_engine = sqlalchemy.create_engine(env['DATABASE_URI'], echo=False)
    with db_engine.connect() as db_connection:
        logging.info("Database connected.")
        db_context = database_context.DatabaseContext(db_connection)

        mq_connection = pika.BlockingConnection(pika.URLParameters(env['RABBITMQ_URI']))
        logging.info("RabbitMQ connected.")
        message_producer.init(mq_connection)
        msg_consumer = message_consumer.MessageConsumer(object_storage, mq_connection, db_context,
                                                        transcriber, supported_models,
                                                        env['USE_GPU'] == 'true')
        msg_consumer.start_consume()


if __name__ == '__main__':
    main()
