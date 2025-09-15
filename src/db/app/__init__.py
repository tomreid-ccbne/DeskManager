from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO
from flask_jwt_extended import JWTManager
import os

# Initialize extensions but don't configure them yet
cors = CORS()
jwt = JWTManager()
socketio = SocketIO()

def create_app():
    """Application Factory Function"""
    app = Flask(__name__)

    # --- Configuration ---
    app.config["JWT_SECRET_KEY"] = "a-super-secret-key-that-you-should-change"
    DB_FILE = os.path.join(os.path.dirname(__file__), '..', 'layout.db')
    app.config["DATABASE"] = DB_FILE

    # --- Initialize Extensions with the App ---
    cors.init_app(app, resources={r"/*": {"origins": "*"}})
    jwt.init_app(app)
    socketio.init_app(app, cors_allowed_origins="*")

    # --- Database ---
    from . import database
    database.init_app(app)

    # --- Register Blueprints (Routes) ---
    from .routes import auth, layout, users
    app.register_blueprint(auth.bp)
    app.register_blueprint(layout.bp)
    app.register_blueprint(users.bp)
    
    # --- Register SocketIO Events ---
    from . import sockets
    sockets.register_sockets(socketio)

    return app
