"""
ECOGUARD Virtual Forest — Seed Data
Populates the database with 5 demo users and 6 months of realistic carbon footprint data.
"""

import random
import sys
import io
from models import init_db, create_user, log_footprint

# Fix Windows console encoding
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

DEMO_USERS = [
    ("Aarav Sharma", 42),
    ("Priya Patel", 17),
    ("Rohan Gupta", 88),
    ("Sneha Kumar", 55),
    ("Vikram Singh", 33),
]

# Realistic monthly CO2 ranges (kg) — Indian household context
# Average Indian monthly footprint: ~150-250 kg CO2
BASE_FOOTPRINTS = {
    "Aarav Sharma":   [220, 205, 195, 180, 170, 160],   # Consistent reducer
    "Priya Patel":    [180, 175, 165, 160, 155, 145],   # Eco champion
    "Rohan Gupta":    [250, 240, 260, 235, 245, 230],   # Up and down
    "Sneha Kumar":    [200, 190, 185, 195, 175, 168],   # Mostly improving
    "Vikram Singh":   [300, 280, 270, 290, 265, 255],   # High but improving
}

MONTHS = [
    (10, 2025), (11, 2025), (12, 2025),
    (1, 2026),  (2, 2026),  (3, 2026),
]


def seed():
    print("[SEED] Initializing ECOGUARD Virtual Forest database...")
    init_db()

    print("[+] Creating demo users...")
    user_ids = {}
    for username, avatar_seed in DEMO_USERS:
        try:
            uid = create_user(username, avatar_seed)
            user_ids[username] = uid
            print(f"   [OK] Created: {username} (ID: {uid})")
        except Exception:
            print(f"   [SKIP] {username} already exists, skipping...")

    print("\n[DATA] Logging footprint data & growing trees...")
    for username, footprints in BASE_FOOTPRINTS.items():
        if username not in user_ids:
            continue
        uid = user_ids[username]
        for i, (month, year) in enumerate(MONTHS):
            # Add slight randomness
            co2 = footprints[i] + random.uniform(-5, 5)
            co2 = round(co2, 2)
            result = log_footprint(uid, month, year, co2)
            health_tag = {"healthy": "[HEALTHY]", "neutral": "[NEUTRAL]", "unhealthy": "[WILTED]"}
            print(f"   {health_tag[result['health']]} {username} - {month}/{year}: {co2} kg CO2 -> {result['health']} {result['species']}")

    print("\n[DONE] Seed complete! Run 'python app.py' to start the server.")


if __name__ == "__main__":
    seed()
