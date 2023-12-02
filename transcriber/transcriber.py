import logging

from whisper import whisper

from message_producer import MessageProducer


class Transcriber:
    def __init__(self, supported_models: [str], use_gpu: bool,
                 message_producer: MessageProducer):
        self.models = dict()
        self.message_producer = message_producer
        for model in supported_models:
            logging.info(f"Start loading whisper model {model}.")
            self.models[model] = whisper.load_model(model, device=('cuda' if use_gpu else 'cpu'))
        logging.info("All whisper models loaded.")

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
            if total_progress != 0:
                logging.info("Transcribing progress: " + "{:.2%}".format(current_progress / total_progress))
            self.message_producer.publish_progress(media, total_progress, current_progress, all_segments,
                                                   current_segments)

        result = self.models[media['Model']].transcribe(file_path, fp16=False, language=(
            media['Language'] if media['Language'] != 'auto' else None), on_progress=__on_progress)
        __on_progress([], [], 0, 0)
        return result
