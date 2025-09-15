from app import create_app, socketio

app = create_app()

if __name__ == '__main__':
    print("Starting Flask-SocketIO server...")
    # The server is now run through socketio.run() using the app created by our factory.
    socketio.run(app, host='0.0.0.0', port=5000)