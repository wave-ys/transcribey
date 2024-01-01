import sqlalchemy
from sqlalchemy import text

MEDIA_STATUS_TRANSCRIBING = 'transcribing'
MEDIA_STATUS_RESULT_SAVED = 'resultSaved'
MEDIA_STATUS_COMPLETED = 'completed'


class DatabaseContext:
    def __init__(self, db_engine: sqlalchemy.Engine, db_connection: sqlalchemy.Connection):
        self.db_connection = db_connection
        self.db_engine = db_engine

    def mark_start_transcribe(self, media_id: str):
        self.db_connection.execute(
            text("update Medias "
                 "set Status = :status "
                 "where Id = :id"),
            {
                "id": media_id,
                "status": MEDIA_STATUS_TRANSCRIBING,
            })

    def mark_result_saved_transcribe(self, media_id: str):
        self.db_connection.execute(
            text("update Medias "
                 "set Status = :status "
                 "where Id = :id"),
            {
                "id": media_id,
                "status": MEDIA_STATUS_RESULT_SAVED,
            })

    def mark_complete_transcribe(self, media_id: str, result_path: str, preface: str):
        self.db_connection.execute(
            text("update Medias set "
                 "Status = :status, ResultPath = :result_path, Preface = :preface "
                 "where Id = :id"),
            {
                "id": media_id,
                "status": MEDIA_STATUS_COMPLETED,
                "result_path": result_path,
                "preface": preface
            })

    def mark_failed(self, media_id: str, reason: str):
        self.db_connection.execute(
            text("update Medias set FileType = 'error', Failed = 1, FailedReason = :reason where Id = :id"),
            {
                "id": media_id,
                "reason": reason
            })

    def fetch_media(self, media_id: str):
        return self.db_connection.execute(
            text("select Id from Medias with (rowlock, xlock) where Id = :id"),
            {
                "id": media_id
            }
        ).fetchone()

    def commit(self):
        self.db_connection.commit()
