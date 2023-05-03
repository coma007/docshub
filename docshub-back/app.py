from flask import Flask
from flask_cors import CORS
from file_managing.endpoints import file_managing_endpoints

app = Flask(__name__)
CORS(app, origins=['http://localhost:3000'])

app.register_blueprint(file_managing_endpoints)

if __name__ == "__main__":
    app.run()