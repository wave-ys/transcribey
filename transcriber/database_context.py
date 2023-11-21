import sqlalchemy
from sqlalchemy import text


class DatabaseContext:
    def __init__(self, db_connection: sqlalchemy.Connection):
        self.db_connection = db_connection

    def update_media_status(self, media_id: str, status):
        self.db_connection.execute(text("update Medias set Status = :status where Id = :id"), {
            "id": media_id,
            "status": status
        })

    def commit(self):
        self.db_connection.commit()
