import json
import os
import sys
from sqlalchemy.orm import Session
from database import SessionLocal, Problem, init_db
from datetime import datetime
import re

def slugify(text):
    text = text.lower()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_-]+', '-', text)
    text = re.sub(r'^-+|-+$', '', text)
    return text

def import_problems(json_path):
    if not os.path.exists(json_path):
        print(f"Error: {json_path} not found.")
        return

    print(f"Loading data from {json_path}...")
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)

    db = SessionLocal()
    try:
        print(f"Importing {len(data)} problems...")
        imported_count = 0
        
        for item in data:
            # Check if problem already exists
            existing = db.query(Problem).filter(Problem.id == item['id']).first()
            if existing:
                continue

            # Determine difficulty (default to Medium if not specified in JSON structure)
            # The JSON seems to have some difficulty info in subtopics sometimes
            difficulty = "Medium"
            if "Easy" in item.get('subtopic', ''):
                difficulty = "Easy"
            elif "Hard" in item.get('subtopic', ''):
                difficulty = "Hard"
            elif "Medium" in item.get('subtopic', ''):
                difficulty = "Medium"

            problem = Problem(
                id=item['id'],
                title=item['name'],
                topic=item['topic'],
                subtopic=item['subtopic'],
                difficulty=difficulty,
                source_link=item['link'],
                order_index=item['id'],
                slug=f"{slugify(item['name'])}-{item['id']}",
                leetcode_link=item['link'] if "leetcode.com" in item['link'] else None
            )
            db.add(problem)
            imported_count += 1
            
            if imported_count % 50 == 0:
                print(f"Imported {imported_count} problems...")

        db.commit()
        print(f"Successfully imported {imported_count} new problems.")
    except Exception as e:
        print(f"Error during import: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    # Ensure tables exist
    init_db()
    
    # Path to dataset
    dataset_path = os.path.join("..", "data", "problems.json")
    import_problems(dataset_path)
