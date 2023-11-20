import json
from os import environ as env

import pika
from dotenv import load_dotenv

TRANSCRIBE_REQUEST_EXCHANGE = 'transcribe-requests'


def main():
    load_dotenv()

    connection = pika.BlockingConnection(pika.URLParameters(env['RABBITMQ_URI']))
    channel = connection.channel()
    queue_name = channel.queue_declare('', exclusive=True, auto_delete=True).method.queue
    channel.queue_bind(queue_name, TRANSCRIBE_REQUEST_EXCHANGE, routing_key='#', arguments={
        'x-match': 'all'
    })

    def callback(ch, method, properties, body):
        media = json.loads(body)
        print(media)

    channel.basic_consume(queue_name,
                          auto_ack=False,
                          on_message_callback=callback)
    channel.start_consuming()


if __name__ == '__main__':
    main()
