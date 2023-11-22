import json
from subprocess import CalledProcessError, run


def detect_file_type(file_path: str):
    cmd = [
        'ffprobe',
        '-show_streams',
        '-print_format',
        'json',
        '-loglevel',
        'quiet',
        file_path
    ]
    try:
        streams = json.loads(run(cmd, capture_output=True, check=True).stdout)['streams']
    except CalledProcessError as e:
        return 'error'

    video_existed = any(x['codec_type'] == 'video' for x in streams)
    audio_existed = any(x['codec_type'] == 'audio' for x in streams)

    if not video_existed and not audio_existed:
        return 'error'
    if not video_existed:
        return 'audio'
    return 'video'
