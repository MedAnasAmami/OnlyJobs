from database import engine
from sqlmodel import Session, select
from models import Utilisateur, Freelancer, Client

def check_users():
    with Session(engine) as session:
        freelancers = session.exec(select(Freelancer)).all()
        print(f"Number of freelancers found: {len(freelancers)}")
        for f in freelancers:
            print(f"- {f.id}")

        clients = session.exec(select(Client)).all()
        print(f"Number of clients found: {len(clients)}")
        for c in clients:
            print(f"- {c.id}")

if __name__ == "__main__":
    check_users()