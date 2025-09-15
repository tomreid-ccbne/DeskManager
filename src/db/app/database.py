import sqlite3
import json
from werkzeug.security import generate_password_hash

def init_db(app):
    # The database initialization logic from your old server.py file
    print("Initializing database...")
    with sqlite3.connect(app.config["DATABASE"]) as conn:
        cursor = conn.cursor()
        # Create all tables...
        cursor.execute('CREATE TABLE IF NOT EXISTS layout (id INTEGER PRIMARY KEY, data TEXT NOT NULL)')
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS layout_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT, timestamp TEXT NOT NULL,
                change_summary TEXT NOT NULL, changed_by TEXT
            )
        ''')
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS desk_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT, desk_id INTEGER NOT NULL,
                timestamp TEXT NOT NULL, changed_by TEXT, change_details TEXT NOT NULL
            )
        ''')
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL,
                role TEXT NOT NULL, department TEXT, team_color TEXT
            )
        ''')
        
        # Seed users if table is empty...
        cursor.execute("SELECT count(*) FROM users")
        if cursor.fetchone()[0] == 0:
            print("Users table is empty. Seeding with default users.")
            default_users = [
                ('admin', generate_password_hash('password', method='pbkdf2:sha256'), 'admin', 'IT', None),
                ('john.smith', generate_password_hash('password', method='pbkdf2:sha256'), 'tl', 'Engineering', '#3b82f6'),
                ('jane.doe', generate_password_hash('password', method='pbkdf2:sha256'), 'tl', 'Marketing', '#8b5cf6')
            ]
            cursor.executemany("INSERT INTO users (name, password_hash, role, department, team_color) VALUES (?, ?, ?, ?, ?)", default_users)

        # Seed layout if table is empty...
        cursor.execute("SELECT count(*) FROM layout WHERE id = 1")
        if cursor.fetchone()[0] == 0:
            print("Layout table is empty. Seeding with default layout.")
            # ... (Full default_data dictionary as before)
            
            default_data = {
              "desks": [
                { "id": 1, "occupant": "Alice Johnson", "department": "Engineering", "notes": "Needs a new monitor.", "x": 10, "y": 15, "w": 12, "h": 12, "teamLead": "John Smith", "breaks": "10:30, 15:00", "sales": 0, "color": "#3b82f6" }
              ], "backgroundImage": "url('https://placehold.co/1200x675/f0f0f0/cccccc?text=Your+Office+Layout+Image')",
              "imageVisible": True, "aspectRatio": "16 / 9", "layoutWidth": 100, "zoom": 100,
              "gridSnap": 5, "gridSnapEnabled": True
            }
            cursor.execute("INSERT INTO layout (id, data) VALUES (?, ?)", (1, json.dumps(default_data)))
        conn.commit()

def init_app(app):
    # This ensures init_db is run when the app starts
    with app.app_context():
        init_db(app)
