import json
from os import environ as env

import pika
import sqlalchemy
from dotenv import load_dotenv
from sqlalchemy import text

TRANSCRIBE_REQUEST_EXCHANGE = 'transcribe-requests'

HANDLE_TRANSCRIBE_QUEUE = 'handle-transcribe-queue'

MEDIA_STATUS_TRANSCRIBING = 'transcribing'
MEDIA_STATUS_COMPLETED = 'completed'


def main():
    load_dotenv()

    mq_connection = pika.BlockingConnection(pika.URLParameters(env['RABBITMQ_URI']))
    channel = mq_connection.channel()
    queue_name = channel.queue_declare(HANDLE_TRANSCRIBE_QUEUE, exclusive=False, auto_delete=True).method.queue
    channel.queue_bind(queue_name, TRANSCRIBE_REQUEST_EXCHANGE, routing_key='#', arguments={
        'x-match': 'all'
    })

    db_engine = sqlalchemy.create_engine(env['DATABASE_URI'], echo=True)
    with db_engine.connect() as db_connection:
        def callback(ch, method, properties, body):
            media = json.loads(body)
            db_connection.execute(text("update Medias set Status = :status where Id = :id"), {
                "id": media["Id"],
                "status": MEDIA_STATUS_TRANSCRIBING
            })
            db_connection.commit()
            ch.basic_ack(delivery_tag=method.delivery_tag)

        channel.basic_qos(prefetch_count=1)
        channel.basic_consume(queue_name,
                              auto_ack=False,
                              on_message_callback=callback)
        channel.start_consuming()


if __name__ == '__main__':
    main()
