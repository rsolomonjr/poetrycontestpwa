import requests
from bs4 import BeautifulSoup
import re
import json
from datetime import datetime

def get_favicon(org):
    return org.strip()[0].upper() if org else "?"

def extract_prize(prize_str):
    if not prize_str:
        return 0
    # Find the largest amount in the string
    amounts = re.findall(r'\$([\d,]+)', prize_str.replace(',', ''))
    if not amounts:
        # Try GBP or EUR
        amounts = re.findall(r'£([\d,]+)|€([\d,]+)', prize_str.replace(',', ''))
        if amounts:
            for tup in amounts:
                for a in tup:
                    if a:
                        return int(a)
        return 0
    return max([int(amt.replace(',', '')) for amt in amounts])

def extract_fee(fee_str):
    if not fee_str:
        return 0
    if 'free' in fee_str.lower():
        return 0
    match = re.search(r'\$?(\d+)', fee_str.replace(',', ''))
    if match:
        return int(match.group(1))
    return 0

def extract_entry_fee(fee_str):
    if not fee_str:
        return "Free"
    if 'free' in fee_str.lower():
        return "Free"
    match = re.search(r'\$?\d+(?:\.\d{1,2})?', fee_str)
    return match.group(0) if match else fee_str

def extract_deadline(deadline_str):
    # Try to convert "August 31, 2025" to "2025-08-31"
    try:
        dt = datetime.strptime(deadline_str, "%B %d, %Y")
        return dt.strftime("%Y-%m-%d")
    except Exception:
        # Try "August 2025"
        try:
            dt = datetime.strptime(deadline_str, "%B %Y")
            return dt.strftime("%Y-%m-01")
        except Exception:
            # Try "TBA" or "Rolling"
            if deadline_str.strip().lower() in ["tba", "rolling", "ongoing"]:
                return ""
    return ""

def parse_chillsubs_contests(page=1):
    url = f"https://www.chillsubs.com/browse/contests?page={page}&sortBy=deadline&contestSearch=poetry&responseTime="
    headers = {
        "User-Agent": "Mozilla/5.0"
    }
    r = requests.get(url, headers=headers)
    soup = BeautifulSoup(r.text, "html.parser")
    contests = []

    # Each contest is in a card, but classes may change; use semantic structure
    for card in soup.select("a[href^='/contest/']"):
        # Name
        name = card.select_one(".chakra-heading") or card.select_one("h2")
        name = name.text.strip() if name else ""
        # Organization
        org = card.select_one(".css-1n5bcd2")  # Organization
        org = org.text.strip() if org else ""
        # Deadline (sometimes on a badge or text)
        deadline = card.select_one(".css-1h0j9p0")
        deadline = deadline.text.strip() if deadline else ""
        # Prize
        prize = ""
        prize_tag = card.find(string=re.compile(r"\$|£|€"))
        if prize_tag:
            prize = prize_tag.strip()
        # Fee
        fee = ""
        fee_tag = card.find(string=re.compile(r"Fee"))
        if fee_tag and fee_tag.parent and fee_tag.parent.next_sibling:
            fee = fee_tag.parent.next_sibling.get_text(strip=True)
        # Description
        desc = ""
        desc_tag = card.select_one(".css-1u2w6s")
        if desc_tag:
            desc = desc_tag.text.strip()
        # URL
        contest_url = "https://www.chillsubs.com" + card.get("href")
        # Build object
        obj = {
            "id": 10000 + hash(name + org + contest_url) % 900000,  # Large id so as not to conflict
            "name": name,
            "organization": org,
            "deadline": extract_deadline(deadline),
            "prize": extract_prize(prize),
            "fee": extract_fee(fee),
            "url": contest_url,
            "favicon": get_favicon(org or name),
            "description": desc if desc else prize,
            "entryFee": extract_entry_fee(fee),
            "isCustom": True
        }
        contests.append(obj)
    return contests

if __name__ == "__main__":
    # Scrape the first page (adjust for more pages if desired)
    contests = parse_chillsubs_contests(page=1)
    # Filter only those with a valid deadline or upcoming
    now = datetime.utcnow().date()
    filtered = []
    for c in contests:
        try:
            if c["deadline"]:
                dt = datetime.strptime(c["deadline"], "%Y-%m-%d").date()
                if dt >= now:
                    filtered.append(c)
            else:
                filtered.append(c)  # Keep rolling/TBA as well
        except Exception:
            filtered.append(c)
    # Output as JSON
    with open("chillsubs_poetry_contests.json", "w", encoding="utf-8") as f:
        json.dump(filtered, f, indent=2, ensure_ascii=False)
    print(f"Exported {len(filtered)} contests to chillsubs_poetry_contests.json")