import json

import pika

TRANSCRIBE_PROGRESS_EXCHANGE = 'transcribe-progresses'


class MessageProducer:
    def __init__(self):
        self.channel = None
        self.mq_connection = None

    def init(self, mq_connection: pika.BlockingConnection):
        self.mq_connection = mq_connection
        self.channel = mq_connection.channel()
        self.channel.exchange_declare(TRANSCRIBE_PROGRESS_EXCHANGE, auto_delete=True)

    def publish_progress(self, media, total_progress, current_progress, all_segments):
        message_body = {
            'segments': [{
                'start': segment['start'],
                'end': segment['end'],
                'text': segment['text']
            } for segment in all_segments],
            'total': total_progress,
            'current': current_progress
        }

        self.channel.basic_publish(TRANSCRIBE_PROGRESS_EXCHANGE, str(media['Id']),
                                   json.dumps(message_body).encode('utf-8'),
                                   pika.BasicProperties(
                                       content_type='application/json'
                                   ))
