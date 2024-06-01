import threading
from flask import Flask
from flask_cors import CORS
from collectingMCdata import read_from_serial
from routes import bp

app = Flask(__name__)
CORS(app)

my_thread = threading.Thread(target=read_from_serial)
my_thread.start()
app.register_blueprint(bp)

if __name__ == '__main__':
    app.run()
