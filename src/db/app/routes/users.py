from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
import sqlite3

bp = Blueprint('users', __name__)

@bp.route('/users', methods=['GET', 'POST'])
@jwt_required()
def handle_users():
    if get_jwt_identity().get('role') != 'admin':
        return jsonify({"msg": "Admins only!"}), 403
    # ... (The rest of the user handling logic is the same, using current_app.config["DATABASE"]) ...
    return jsonify([])

@bp.route('/users/<int:user_id>', methods=['PUT', 'DELETE'])
@jwt_required()
def handle_user(user_id):
    if get_jwt_identity().get('role') != 'admin':
        return jsonify({"msg": "Admins only!"}), 403
    # ... (The rest of the user handling logic is the same, using current_app.config["DATABASE"]) ...
    return jsonify({"status": "success"})