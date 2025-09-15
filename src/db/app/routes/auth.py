from flask import Blueprint, request, jsonify, current_app
import sqlite3
from werkzeug.security import check_password_hash
from flask_jwt_extended import create_access_token

bp = Blueprint('auth', __name__)

@bp.route('/login', methods=['POST'])
def login():
    username = request.json.get('username', None)
    password = request.json.get('password', None)
    
    with sqlite3.connect(current_app.config["DATABASE"]) as conn:
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM users WHERE name = ?", (username,))
        user = cursor.fetchone()

        if user and check_password_hash(user['password_hash'], password):
            identity = {'id': user['id'], 'name': user['name'], 'role': user['role']}
            access_token = create_access_token(identity=identity)
            user_dict = dict(user)
            del user_dict['password_hash'] # Don't send the hash to the client
            return jsonify(access_token=access_token, user=user_dict)
        
        return jsonify({"msg": "Bad username or password"}), 401
