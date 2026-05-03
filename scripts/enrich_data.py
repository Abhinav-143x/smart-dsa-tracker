import json
import re
import os

def parse_markdown_and_update_json(md_path, json_path):
    if not os.path.exists(md_path):
        print(f"Error: {md_path} not found")
        return
    if not os.path.exists(json_path):
        print(f"Error: {json_path} not found")
        return

    print(f"Reading {md_path}...")
    with open(md_path, 'r', encoding='utf-8') as f:
        md_content = f.read()

    # Split by problem sections
    problem_sections = re.split(r'### \d+\.', md_content)
    
    enriched_data = {}
    
    for section in problem_sections:
        # Extract ID
        id_match = re.search(r'- \*\*Problem ID\*\*: (\d+)', section)
        if not id_match:
            continue
        
        prob_id = int(id_match.group(1))
        
        # Extract YouTube
        yt_match = re.search(r'- \*\*YouTube\*\*: \[?([^\]\n]+)\]?', section)
        # Extract Article
        article_match = re.search(r'- \*\*Article\*\*: \[?([^\]\n]+)\]?', section)
        # Extract LeetCode
        lc_match = re.search(r'- \*\*LeetCode\*\*: \[?([^\]\n]+)\]?', section)
        
        def clean_url(url):
            if not url: return None
            # Handle [text](url) format
            url = url.strip()
            if url.startswith('(') and url.endswith(')'):
                url = url[1:-1]
            elif '](' in url:
                url = url.split('](')[1].rstrip(')')
            return url

        enriched_data[prob_id] = {
            'youtube_link': clean_url(yt_match.group(1)) if yt_match else None,
            'article_link': clean_url(article_match.group(1)) if article_match else None,
            'leetcode_link': clean_url(lc_match.group(1)) if lc_match else None
        }

    print(f"Reading {json_path}...")
    with open(json_path, 'r', encoding='utf-8') as f:
        json_data = json.load(f)

    updated_count = 0
    for item in json_data:
        prob_id = item.get('id')
        if prob_id in enriched_data:
            extras = enriched_data[prob_id]
            if extras['youtube_link']:
                item['youtube_link'] = extras['youtube_link']
            if extras['article_link']:
                item['article_link'] = extras['article_link']
            if extras['leetcode_link']:
                # Update leetcode link if it's actually a leetcode link
                if 'leetcode.com' in extras['leetcode_link']:
                    item['leetcode_link'] = extras['leetcode_link']
            updated_count += 1

    print(f"Writing updated data to {json_path}...")
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(json_data, f, indent=2)

    print(f"Successfully enriched {updated_count} problems in JSON.")

if __name__ == "__main__":
    parse_markdown_and_update_json('../DSA_SHEET_FIXED.md', 'data/problems.json')
