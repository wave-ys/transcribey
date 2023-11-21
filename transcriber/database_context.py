import sqlalchemy
from sqlalchemy import text

MEDIA_STATUS_TRANSCRIBING = 'transcribing'
MEDIA_STATUS_COMPLETED = 'completed'


class DatabaseContext:
    def __init__(self, db_connection: sqlalchemy.Connection):
        self.db_connection = db_connection

    def start_transcribe(self, media_id: str):
        self.db_connection.execute(text("update Medias set Status = :status where Id = :id"), {
            "id": media_id,
            "status": MEDIA_STATUS_TRANSCRIBING
        })

    def complete_transcribe(self, media_id: str, result_path: str):
        self.db_connection.execute(
            text("update Medias set Status = :status, ResultPath = :result_path where Id = :id"),
            {
                "id": media_id,
                "status": MEDIA_STATUS_COMPLETED,
                "result_path": result_path
            })

    def commit(self):
        self.db_connection.commit()
