from whisper import whisper

from message_producer import MessageProducer


class Transcriber:
    def __init__(self, supported_models: [str], use_gpu: bool,
                 message_producer: MessageProducer):
        self.models = dict()
        self.message_producer = message_producer
        for model in supported_models:
            self.models[model] = whisper.load_model(model, device=('cuda' if use_gpu else 'cpu'))

    def transcribe(self, media, file_path):
        result = self.do_transcribe(media, file_path)
        data = [{
            'start': segment['start'],
            'end': segment['end'],
            'text': segment['text']
        } for segment in result['segments']]
        preface = result['text'][0:101]
        return dict(data=data, preface=preface)

    def do_transcribe(self, media, file_path):
        def __on_progress(all_segments, current_segments, total_progress, current_progress):
            print(current_progress * 1.0 / total_progress)
            self.message_producer.publish_progress(media, total_progress, current_progress, all_segments)

        return self.models[media['Model']].transcribe(file_path, fp16=False, language=(
            media['Language'] if media['Language'] != 'auto' else None), on_progress=__on_progress)
