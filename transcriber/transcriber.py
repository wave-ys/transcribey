import os
import tempfile

import whisper

from object_storage import ObjectStorage


class Transcriber:
    def __init__(self, object_storage: ObjectStorage, supported_models: [str], use_gpu: bool):
        self.object_storage = object_storage
        self.models = dict()
        for model in supported_models:
            self.models[model] = whisper.load_model(model)

    def do_transcribe(self, media):
        temp_file = tempfile.NamedTemporaryFile(delete=False)
        temp_file.close()

        try:
            self.object_storage.download_media(media, temp_file.name)
            result = self.models[media['Model']].transcribe(temp_file.name, fp16=False)
            print(result['text'])
        finally:
            os.unlink(temp_file.name)
