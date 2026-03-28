"""
ECOGUARD Virtual Forest — MongoDB Models
Shared database layer with Node.js backend using MongoDB Atlas.
"""

import os
from datetime import datetime
from pymongo import MongoClient, DESCENDING
from bson import ObjectId
import certifi

# MongoDB Connection
MONGO_URI = os.environ.get("MONGO_URI") or "mongodb+srv://user_1:DfKuyD4ptFHD8xgr@user.g0xdwqh.mongodb.net/?appName=User"
client = MongoClient(MONGO_URI, tlsCAFile=certifi.where())
db = client.get_database("test") # Map to the shared 'test' database

def get_db_collections():
    """Returns the shared MongoDB collections."""
    # Collections pluralized by Mongoose in Node.js backend
    return db.users, db.footprints, db.trees

def init_db():
    """No-op for MongoDB."""
    pass

# ─── Helpers ───────────────────────────────────────────────────

def to_dict(doc):
    """Convert MongoDB document to JSON-serializable dict with field mapping."""
    if not doc:
        return None
    
    # Map MongoDB _id to string 'id'
    if '_id' in doc:
        doc['id'] = str(doc['_id'])
        del doc['_id']
    
    # CRITICAL: Convert ANY other ObjectId fields to strings (e.g. userId)
    for key, value in doc.items():
        if isinstance(value, ObjectId):
            doc[key] = str(value)

    # Map database CamelCase fields to snake_case for the legacy Flask frontend
    if 'earnedMonth' in doc:
        doc['earned_month'] = doc.pop('earnedMonth')
    if 'earnedYear' in doc:
        doc['earned_year'] = doc.pop('earnedYear')
    
    return doc

# ─── User Operations ───────────────────────────────────────────

def create_user(username, avatar_seed=1):
    users_col, _, _ = get_db_collections()
    existing = users_col.find_one({"username": username})
    if existing:
        return str(existing['_id'])
    
    result = users_col.insert_one({
        "username": username,
        "email": f"{username.lower().replace(' ', '.')}@example.com",
        "avatar": f"https://api.dicebear.com/7.x/avataaars/svg?seed={avatar_seed}",
        "created_at": datetime.now()
    })
    return str(result.inserted_id)

def get_all_users():
    users_col, _, _ = get_db_collections()
    cursor = users_col.find().sort("username", 1)
    return [to_dict(u) for u in cursor]

def get_user(user_id):
    users_col, _, _ = get_db_collections()
    try:
        user = users_col.find_one({"_id": ObjectId(user_id)})
        return to_dict(user)
    except:
        return None

# ─── Footprint Operations ──────────────────────────────────────

def log_footprint(user_id, month, year, co2_kg):
    """Log a monthly footprint and evaluate tree rewards."""
    users_col, footprints_col, trees_col = get_db_collections()
    uid = ObjectId(user_id)

    # Update or insert footprint
    footprints_col.update_one(
        {"userId": uid, "month": month, "year": year},
        {"$set": {"co2_kg": co2_kg, "updatedAt": datetime.now()}},
        upsert=True
    )

    # Get previous month's footprint
    prev_month = month - 1 if month > 1 else 12
    prev_year = year if month > 1 else year - 1
    prev = footprints_col.find_one({"userId": uid, "month": prev_month, "year": prev_year})

    # Determine tree reward
    species_pool = ['oak', 'pine', 'maple', 'birch', 'cherry', 'willow']
    import random
    species = random.choice(species_pool)

    if not prev:
        health = 'healthy'
    else:
        prev_co2 = prev['co2_kg']
        change_pct = ((co2_kg - prev_co2) / prev_co2) * 100 if prev_co2 > 0 else 0
        health = 'healthy' if change_pct < -5 else ('neutral' if change_pct <= 5 else 'unhealthy')

    # Update or Create Tree
    trees_col.update_one(
        {"userId": uid, "earnedMonth": month, "earnedYear": year},
        {
            "$set": {
                "health": health,
                "species": species,
                "updatedAt": datetime.now()
            }
        },
        upsert=True
    )

    return {'health': health, 'species': species, 'co2_kg': co2_kg}

def get_footprints(user_id):
    _, footprints_col, _ = get_db_collections()
    cursor = footprints_col.find({"userId": ObjectId(user_id)}).sort([("year", 1), ("month", 1)])
    return [to_dict(f) for f in cursor]

# ─── Tree / Forest Operations ──────────────────────────────────

def get_forest(user_id):
    _, _, trees_col = get_db_collections()
    cursor = trees_col.find({"userId": ObjectId(user_id)}).sort([("earnedYear", 1), ("earnedMonth", 1)])
    return [to_dict(t) for t in cursor]

# ─── Leaderboard & Stats ───────────────────────────────────────

def get_leaderboard():
    """Rank users by avg CO2/month using MongoDB aggregation."""
    users_col, footprints_col, trees_col = get_db_collections()
    
    pipeline = [
        {
            "$lookup": {
                "from": "footprints",
                "localField": "_id",
                "foreignField": "userId",
                "as": "footprint_data"
            }
        },
        {
            "$lookup": {
                "from": "trees",
                "localField": "_id",
                "foreignField": "userId",
                "as": "tree_data"
            }
        },
        {
            "$project": {
                "username": 1,
                "avatar": 1,
                "months_tracked": {"$size": "$footprint_data"},
                "total_co2": {"$sum": "$footprint_data.co2_kg"},
                "tree_requirement_score": {
                    "$cond": [
                        {"$gt": [{"$size": "$footprint_data"}, 0]},
                        {"$divide": [{"$sum": "$footprint_data.co2_kg"}, {"$size": "$footprint_data"}]},
                        0
                    ]
                },
                "total_trees": {"$size": "$tree_data"},
                "healthy_trees": {
                    "$size": {
                        "$filter": {
                            "input": "$tree_data",
                            "as": "t",
                            "cond": {"$eq": ["$$t.health", "healthy"]}
                        }
                    }
                }
            }
        },
        {"$sort": {"tree_requirement_score": 1}}
    ]
    
    cursor = users_col.aggregate(pipeline)
    # Ensure items are serializable
    return [to_dict(u) for u in cursor]

def get_user_stats(user_id):
    users_col, footprints_col, trees_col = get_db_collections()
    uid = ObjectId(user_id)
    
    user = users_col.find_one({"_id": uid})
    if not user:
        return None
    
    footprints = list(footprints_col.find({"userId": uid}).sort([("year", 1), ("month", 1)]))
    trees = list(trees_col.find({"userId": uid}).sort([("earnedYear", 1), ("earnedMonth", 1)]))
    
    streak = 0
    for i in range(len(footprints) - 1, 0, -1):
        if footprints[i]['co2_kg'] < footprints[i-1]['co2_kg']:
            streak += 1
        else:
            break
            
    best_month = None
    if footprints:
        best = min(footprints, key=lambda x: x['co2_kg'])
        best_month = {'month': best['month'], 'year': best['year'], 'co2_kg': best['co2_kg']}
        
    return {
        'user': to_dict(user),
        'footprints': [to_dict(f) for f in footprints],
        'trees': [to_dict(t) for t in trees],
        'streak': streak,
        'total_trees': len(trees),
        'healthy_trees': sum(1 for t in trees if t['health'] == 'healthy'),
        'best_month': best_month,
        'latest_footprint': to_dict(footprints[-1]) if footprints else None
    }
