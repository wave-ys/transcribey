from subprocess import CalledProcessError, run


def generate_thumbnail(file_path: str, output_path: str):
    cmd = [
        'ffmpeg',
        '-loglevel',
        'quiet',
        '-i',
        file_path,
        '-vf',
        'thumbnail=300',
        '-frames:v',
        '1',
        '-y',
        output_path
    ]

    try:
        run(cmd, check=True)
    except CalledProcessError as e:
        raise e
