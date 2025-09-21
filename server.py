from flask import Flask, request, jsonify
from pymongo import MongoClient
from flask_cors import CORS
import logging
from bson.objectid import ObjectId
import imghdr


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:4200"}})
logging.basicConfig(level=logging.DEBUG)

client = MongoClient('mongodb://localhost:27017/')
db = client['cat']

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    try:
        emailString = data['email']
        passwordString = data['password']
        user = list(db['login'].find({ 'email': emailString }))
        if len((user)) == 0:
            db['login'].insert_one({ 'email': emailString, 'password': passwordString })
            return jsonify(message='Account created'), 200
        else:
            if (user)[0]['password'] != passwordString:
                return jsonify(message='Wrong password'), 400
            else:
                return jsonify(message="Successful login"), 200
    except Exception as e:
        logging.error(f"Error during login: {e}")
        return jsonify(message='Error during login'), 500

@app.route('/addCat', methods=['POST'])
def add_cat():
    data = request.json
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # Read file content
    image_data = file.read()

    # Validate it's an image
    if not imghdr.what(None, h=image_data):
        return jsonify({"error": "Uploaded file is not a valid image"}), 400


    try:
        nameString = data['name']
        ageNumber = data['age']
        breedString = data['breed']
        comments = data['comments']
        author = data['author']
        db['cats'].insert_one({ 'name': nameString, 'age': ageNumber, 'breed': breedString, "filename": file.filename,
 'comments': comments, author: author, })
        return jsonify(message='Cat added'), 200
    except Exception as e:
        logging.error(f"Error adding cat: {e}")
        return jsonify(message='Error adding cat'), 500

@app.route('/deleteCat', methods=['DELETE'])
def delete_cat():
    data = request.json
    try:
        id = data['id']
        db['cats'].delete_one({ '_id': ObjectId(id) })
        return jsonify(message='Cat deleted'), 200
    except Exception as e:
        logging.error(f"Error deleting cat: {e}")
        return jsonify(message='Error deleting cat'), 500

@app.route('/getAllCats', methods=['GET'])
def get_all_cats():
    try:
        cats = list(db['cats'].find())
        for cat in cats:
            cat['_id'] = str(cat['_id'])  # Convert ObjectId to string for JSON serialization
        return jsonify(cats), 200
    except Exception as e:
        logging.error(f"Error retrieving cats: {e}")
        return jsonify(message='Error retrieving cats'), 500
