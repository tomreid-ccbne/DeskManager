from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
import sqlite3
import json
from datetime import datetime

bp = Blueprint('layout', __name__)

# ... (generate_detailed_changes helper function goes here, unchanged) ...
def generate_detailed_changes(old_data, new_data):
    """Generate detailed change summaries for layout updates"""
    changes = {
        'layout_summary': "Layout updated",
        'desk_changes': {}
    }
    
    old_desks = {desk['id']: desk for desk in old_data.get('desks', [])}
    new_desks = {desk['id']: desk for desk in new_data.get('desks', [])}
    
    # Check for new, modified, or deleted desks
    for desk_id, new_desk in new_desks.items():
        if desk_id not in old_desks:
            changes['desk_changes'][desk_id] = f"Added new desk for {new_desk.get('occupant', 'Vacant')}"
        elif old_desks[desk_id] != new_desk:
            changes['desk_changes'][desk_id] = f"Modified desk for {new_desk.get('occupant', 'Vacant')}"
    
    for desk_id in old_desks:
        if desk_id not in new_desks:
            changes['desk_changes'][desk_id] = f"Deleted desk for {old_desks[desk_id].get('occupant', 'Vacant')}"
    
    return changes

@bp.route('/layout-data', methods=['GET', 'POST'])
@jwt_required(optional=True)
def handle_layout_data():
    if request.method == 'GET':
        try:
            with sqlite3.connect(current_app.config["DATABASE"]) as conn:
                cursor = conn.cursor()
                cursor.execute("SELECT data FROM layout WHERE id = 1")
                result = cursor.fetchone()
                if result:
                    return jsonify(json.loads(result[0]))
                else:
                    # Return default layout if none exists
                    default_layout = {
                        "desks": [],
                        "darkMode": False,
                        "layoutWidth": 90,
                        "zoom": 100,
                        "aspectRatio": "16/9",
                        "imageVisible": False,
                        "backgroundImage": ""
                    }
                    return jsonify(default_layout)
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    elif request.method == 'POST':
        current_user = get_jwt_identity()
        if not current_user:
            return jsonify({"msg": "Authentication required"}), 401
        
        try:
            new_data = request.get_json()
            
            with sqlite3.connect(current_app.config["DATABASE"]) as conn:
                cursor = conn.cursor()
                
                # Get old data for change tracking
                cursor.execute("SELECT data FROM layout WHERE id = 1")
                result = cursor.fetchone()
                old_data = json.loads(result[0]) if result else {}
                
                # Update layout
                cursor.execute("INSERT OR REPLACE INTO layout (id, data) VALUES (?, ?)", 
                             (1, json.dumps(new_data)))
                
                # Log the change
                changes = generate_detailed_changes(old_data, new_data)
                timestamp = datetime.now().isoformat()
                cursor.execute(
                    "INSERT INTO layout_history (timestamp, change_summary, changed_by) VALUES (?, ?, ?)",
                    (timestamp, changes['layout_summary'], current_user.get('name'))
                )
                
                # Log individual desk changes
                for desk_id, change_detail in changes['desk_changes'].items():
                    cursor.execute(
                        "INSERT INTO desk_history (desk_id, timestamp, changed_by, change_details) VALUES (?, ?, ?, ?)",
                        (desk_id, timestamp, current_user.get('name'), change_detail)
                    )
                
                conn.commit()
                return jsonify({"status": "success"})
                
        except Exception as e:
            return jsonify({"error": str(e)}), 500

@bp.route('/layout-history', methods=['GET'])
@jwt_required()
def get_layout_history():
    try:
        with sqlite3.connect(current_app.config["DATABASE"]) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute(
                "SELECT * FROM layout_history ORDER BY timestamp DESC LIMIT 50"
            )
            history = [dict(row) for row in cursor.fetchall()]
            return jsonify(history)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bp.route('/desk-history/<int:desk_id>', methods=['GET'])
@jwt_required()
def get_desk_history(desk_id):
    try:
        with sqlite3.connect(current_app.config["DATABASE"]) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute(
                "SELECT * FROM desk_history WHERE desk_id = ? ORDER BY timestamp DESC LIMIT 20",
                (desk_id,)
            )
            history = [dict(row) for row in cursor.fetchall()]
            return jsonify(history)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
