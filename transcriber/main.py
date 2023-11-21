from os import environ as env

import pika
import sqlalchemy
from dotenv import load_dotenv

import database_context
import message_consumer


def main():
    load_dotenv()

    mq_connection = pika.BlockingConnection(pika.URLParameters(env['RABBITMQ_URI']))
    db_engine = sqlalchemy.create_engine(env['DATABASE_URI'], echo=True)

    with db_engine.connect() as db_connection:
        db_context = database_context.DatabaseContext(db_connection)

        msg_consumer = message_consumer.MessageConsumer(mq_connection, db_context)
        msg_consumer.start_consume()


if __name__ == '__main__':
    main()
