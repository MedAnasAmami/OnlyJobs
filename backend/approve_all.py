import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import engine
from sqlmodel import Session
from sqlalchemy import text

def approve_all():
    with Session(engine) as session:
        session.exec(text("UPDATE profil SET statut = 'accepte'"))
        session.exec(text("UPDATE annonce SET statut = 'approuve'"))
        session.commit()
        print("Successfully approved all existing profils and annonces!")

if __name__ == "__main__":
    approve_all()