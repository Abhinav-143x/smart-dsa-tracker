import json
import re
import os

def regroup_problems(md_path, json_path):
    if not os.path.exists(md_path):
        print(f"Error: {md_path} not found")
        return
    if not os.path.exists(json_path):
        print(f"Error: {json_path} not found")
        return

    print(f"Reading {md_path}...")
    with open(md_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    current_topic = ""
    current_subtopic = ""
    new_grouping = [] # List of (title, topic, subtopic, difficulty)
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        # Topic Match (## Topic Name)
        topic_match = re.match(r'^##\s+(.+)$', line)
        if topic_match:
            current_topic = topic_match.group(1).strip()
            # Remove progress counts like "0 / 27" if present
            current_topic = re.sub(r'\d+\s+/\s+\d+', '', current_topic).strip()
            continue
            
        # Subtopic Match (### Difficulty Problems)
        subtopic_match = re.match(r'^###\s+(.+)$', line)
        if subtopic_match:
            current_subtopic = subtopic_match.group(1).strip()
            current_subtopic = re.sub(r'\d+\s+/\s+\d+', '', current_subtopic).strip()
            continue
            
        # Problem Row Match (| ⬜ | **Problem Title** | ...)
        if line.startswith('| ⬜ |'):
            # Extract title between ** **
            title_match = re.search(r'\*\*(.+?)\*\*', line)
            if title_match:
                title = title_match.group(1).strip()
                # Determine difficulty from subtopic or row
                difficulty = "Medium"
                if "Easy" in current_subtopic or "Easy" in line:
                    difficulty = "Easy"
                elif "Hard" in current_subtopic or "Hard" in line:
                    difficulty = "Hard"
                elif "Medium" in current_subtopic or "Medium" in line:
                    difficulty = "Medium"
                
                new_grouping.append({
                    'title': title,
                    'topic': current_topic,
                    'subtopic': current_subtopic,
                    'difficulty': difficulty
                })

    print(f"Parsed {len(new_grouping)} problem mappings from Markdown.")

    print(f"Reading {json_path}...")
    with open(json_path, 'r', encoding='utf-8') as f:
        json_data = json.load(f)

    # Create a map of existing problems by title for faster lookup
    # Using normalized title as key
    def normalize(t):
        return re.sub(r'\s+', ' ', t.lower().strip())

    existing_map = {}
    for item in json_data:
        nt = normalize(item['name'])
        if nt not in existing_map:
            existing_map[nt] = []
        existing_map[nt].append(item)

    updated_count = 0
    not_found = []
    
    # We will build a new JSON list to maintain the order from the MD file if possible,
    # or just update the existing one. Let's update existing to keep IDs.
    
    # Track which IDs have been updated to avoid double-dipping if titles are identical
    updated_ids = set()

    # Re-order the entire dataset based on the MD sequence
    new_json_data = []
    
    current_index = 1
    for mapping in new_grouping:
        nt = normalize(mapping['title'])
        if nt in existing_map:
            found = False
            for item in existing_map[nt]:
                if item['id'] not in updated_ids:
                    item['topic'] = mapping['topic']
                    item['subtopic'] = mapping['subtopic']
                    item['difficulty'] = mapping['difficulty']
                    item['order_index'] = current_index
                    new_json_data.append(item)
                    updated_ids.add(item['id'])
                    updated_count += 1
                    current_index += 1
                    found = True
                    break
            if not found:
                # All instances of this title already used
                not_found.append(mapping['title'])
        else:
            not_found.append(mapping['title'])

    # Add any remaining problems that weren't in the new MD grouping
    remaining_count = 0
    for item in json_data:
        if item['id'] not in updated_ids:
            new_json_data.append(item)
            remaining_count += 1

    print(f"Updated {updated_count} problems.")
    print(f"Kept {remaining_count} problems as is (not found in new grouping).")
    if not_found:
        print(f"Titles not found in JSON: {len(set(not_found))}")
        # print(list(set(not_found))[:10])

    print(f"Writing updated data to {json_path}...")
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(new_json_data, f, indent=2)

    print(f"Successfully regrouped problems in JSON.")

if __name__ == "__main__":
    regroup_problems('DSA_SHEET_OFFICIAL_FORMAT - Copy.md', 'data/problems.json')
