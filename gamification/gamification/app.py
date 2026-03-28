"""
ECOGUARD Virtual Forest — Flask Backend
API server for the Virtual Forest gamification system.
"""

from flask import Flask, jsonify, request, render_template, send_from_directory
from flask_cors import CORS
import os
from models import init_db, get_all_users, get_user, log_footprint, get_footprints, get_forest, get_leaderboard, get_user_stats

app = Flask(__name__,
            template_folder='templates',
            static_folder='static')
CORS(app) # Enable CORS for all routes


# ─── Pages ─────────────────────────────────────────────────────

@app.route('/')
def index():
    return render_template('index.html')


# ─── API: Users ────────────────────────────────────────────────

@app.route('/api/users', methods=['GET', 'POST'])
def api_users():
    if request.method == 'POST':
        data = request.get_json()
        if not data or 'username' not in data:
            return jsonify({'error': 'username is required'}), 400
        
        from models import create_user, get_db_collections
        try:
            # Check if exists first
            users_col, _, _ = get_db_collections()
            user = users_col.find_one({"username": data['username']})
            
            if user:
                return jsonify({'message': 'User already exists', 'id': str(user['_id'])})
            
            user_id = create_user(data['username'], data.get('avatar_seed', 1))
            return jsonify({'message': 'User created', 'id': user_id}), 201
        except Exception as e:
            return jsonify({'error': str(e)}), 500
            
    return jsonify(get_all_users())


@app.route('/api/users/<user_id>', methods=['GET'])
def api_user(user_id):
    user = get_user(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify(user)


# ─── API: Footprint ────────────────────────────────────────────

@app.route('/api/users/by-username/<username>/footprint', methods=['POST'])
def api_log_footprint_by_username(username):
    data = request.get_json()
    if not data:
        return jsonify({'error': 'JSON body required'}), 400

    from datetime import datetime
    month = data.get('month', datetime.now().month)
    year = data.get('year', datetime.now().year)
    co2_kg = data.get('co2_kg')

    if co2_kg is None:
        return jsonify({'error': 'co2_kg is required'}), 400
    
    from models import log_footprint, get_db
    try:
        users_col, _, _ = get_db_collections()
        user = users_col.find_one({"username": username})
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
            
        user_id = str(user['_id'])
        result = log_footprint(user_id, int(month), int(year), float(co2_kg))
        return jsonify({
            'message': 'Footprint logged successfully',
            'tree_earned': result
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/users/<user_id>/footprint', methods=['POST'])
def api_log_footprint(user_id):
    data = request.get_json()
    if not data:
        return jsonify({'error': 'JSON body required'}), 400

    from datetime import datetime
    month = data.get('month', datetime.now().month)
    year = data.get('year', datetime.now().year)
    co2_kg = data.get('co2_kg')

    if co2_kg is None:
        return jsonify({'error': 'co2_kg is required'}), 400

    try:
        from models import log_footprint
        result = log_footprint(user_id, int(month), int(year), float(co2_kg))
        return jsonify({
            'message': 'Footprint logged successfully',
            'tree_earned': result
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/users/<user_id>/footprints', methods=['GET'])
def api_footprints(user_id):
    return jsonify(get_footprints(user_id))


# ─── API: Forest ───────────────────────────────────────────────

@app.route('/api/users/<user_id>/forest', methods=['GET'])
def api_forest(user_id):
    user = get_user(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    return jsonify({
        'user': user,
        'trees': get_forest(user_id)
    })


# ─── API: Leaderboard ─────────────────────────────────────────

@app.route('/api/leaderboard', methods=['GET'])
def api_leaderboard():
    return jsonify(get_leaderboard())


# ─── API: User Stats ──────────────────────────────────────────

@app.route('/api/users/<user_id>/stats', methods=['GET'])
def api_stats(user_id):
    stats = get_user_stats(user_id)
    if not stats:
        return jsonify({'error': 'User not found'}), 404
    return jsonify(stats)


# ─── Start Server ─────────────────────────────────────────────

if __name__ == '__main__':
    print("[ECOGUARD] Virtual Forest — Starting server...")
    init_db()
    print("[SERVER] Running at http://localhost:5001")
    app.run(host='0.0.0.0', port=5001, debug=True)
