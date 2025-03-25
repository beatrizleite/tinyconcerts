from flask import Flask, jsonify
from flasgger import Swagger
from flask_cors import CORS
import config  # Importing config for env variables

app = Flask(__name__)
Swagger(app)
CORS(app)

@app.route('/api/hello', methods=['GET'])
def hello():
    return jsonify({"message": "Hello from Flask!"})

if __name__ == '__main__':
    app.run(debug=True, host=config.FLASK_RUN_HOST, port=int(config.FLASK_RUN_PORT))
