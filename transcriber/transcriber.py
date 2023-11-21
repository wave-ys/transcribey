import json
import os
import tempfile

from whisper import whisper

from message_producer import MessageProducer
from object_storage import ObjectStorage


class Transcriber:
    def __init__(self, object_storage: ObjectStorage, supported_models: [str], use_gpu: bool,
                 message_producer: MessageProducer):
        self.object_storage = object_storage
        self.models = dict()
        self.message_producer = message_producer
        for model in supported_models:
            self.models[model] = whisper.load_model(model, device=('cuda' if use_gpu else 'cpu'))

    def transcribe(self, media, result_path: str):
        temp_file = tempfile.NamedTemporaryFile(delete=False)
        temp_file.close()

        try:
            self.object_storage.download_media(media, temp_file.name)
            result = self.do_transcribe(media, temp_file.name)
            data = [{
                'start': segment['start'],
                'end': segment['end'],
                'text': segment['text']
            } for segment in result['segments']]
            self.object_storage.store_result(json.dumps(data), result_path)
        finally:
            os.unlink(temp_file.name)

    def do_transcribe(self, media, file_path):
        def __on_progress(all_segments, current_segments, total_progress, current_progress):
            print(current_progress * 1.0 / total_progress)
            self.message_producer.publish_progress(media, total_progress, current_progress, all_segments)

        return self.models[media['Model']].transcribe(file_path, fp16=False, language=(
            media['Language'] if media['Language'] != 'auto' else None), on_progress=__on_progress)
