from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
import sqlite3

bp = Blueprint('users', __name__)

@bp.route('/users', methods=['GET', 'POST'])
@jwt_required()
def handle_users():
    if get_jwt_identity().get('role') != 'admin':
        return jsonify({"msg": "Admins only!"}), 403
    
    if request.method == 'GET':
        try:
            with sqlite3.connect(current_app.config["DATABASE"]) as conn:
                conn.row_factory = sqlite3.Row
                cursor = conn.cursor()
                cursor.execute("SELECT id, name, role, department, team_color FROM users")
                users = [dict(row) for row in cursor.fetchall()]
                return jsonify(users)
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    elif request.method == 'POST':
        try:
            user_data = request.get_json()
            with sqlite3.connect(current_app.config["DATABASE"]) as conn:
                cursor = conn.cursor()
                cursor.execute(
                    "INSERT INTO users (name, password_hash, role, department, team_color) VALUES (?, ?, ?, ?, ?)",
                    (user_data['name'], user_data['password_hash'], user_data['role'], 
                     user_data.get('department'), user_data.get('team_color'))
                )
                conn.commit()
                return jsonify({"status": "success"})
        except Exception as e:
            return jsonify({"error": str(e)}), 500

@bp.route('/users/<int:user_id>', methods=['PUT', 'DELETE'])
@jwt_required()
def handle_user(user_id):
    if get_jwt_identity().get('role') != 'admin':
        return jsonify({"msg": "Admins only!"}), 403
    
    if request.method == 'PUT':
        try:
            user_data = request.get_json()
            with sqlite3.connect(current_app.config["DATABASE"]) as conn:
                cursor = conn.cursor()
                cursor.execute(
                    "UPDATE users SET name=?, role=?, department=?, team_color=? WHERE id=?",
                    (user_data['name'], user_data['role'], user_data.get('department'), 
                     user_data.get('team_color'), user_id)
                )
                conn.commit()
                return jsonify({"status": "success"})
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    
    elif request.method == 'DELETE':
        try:
            with sqlite3.connect(current_app.config["DATABASE"]) as conn:
                cursor = conn.cursor()
                cursor.execute("DELETE FROM users WHERE id=?", (user_id,))
                conn.commit()
                return jsonify({"status": "success"})
        except Exception as e:
            return jsonify({"error": str(e)}), 500