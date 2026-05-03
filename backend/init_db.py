"""Initialize database and create tables"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from database import init_db, engine
from sqlalchemy import text

def main():
    print("Initializing database...")
    init_db()
    print("Database tables created successfully")

    # Verify tables
    with engine.connect() as conn:
        result = conn.execute(text("SELECT name FROM sqlite_master WHERE type='table'"))
        tables = [row[0] for row in result]
        print(f"Created tables: {', '.join(tables)}")

if __name__ == "__main__":
    main()