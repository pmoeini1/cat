from flask import Flask, request, jsonify
from pymongo import MongoClient
from flask_cors import CORS
import logging
from bson.objectid import ObjectId
import imghdr
from bson import Binary
import base64
from werkzeug.utils import secure_filename
import os
import gridfs



app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
logging.basicConfig(level=logging.DEBUG)

client = MongoClient('mongodb://localhost:27017/')
db = client['cat']
fs = gridfs.GridFS(db)  

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
        return jsonify(message=f'Error during login'), 500

@app.route('/addCat', methods=['POST'])
def add_cat():
    try:
        # Check if file is present
        if 'file' not in request.files:
            return jsonify({"error": "No file part"}), 400

        file = request.files['file']

        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400

        # Read file content for validation
        image_data = file.read()

        # Validate it's an image
        if not imghdr.what(None, h=image_data):
            return jsonify({"error": "Uploaded file is not a valid image"}), 400

        # Rewind the file stream so GridFS can read it again
        file.stream.seek(0)

        # Extract form fields
        name = request.form.get('name')
        age = request.form.get('age')
        breed = request.form.get('breed')
        comments = request.form.get('comments')
        author = request.form.get('author')

        # Store image in GridFS
        image_id = fs.put(file, filename=file.filename, content_type=file.content_type)

        # Insert cat document into MongoDB
        db.cats.insert_one({
            'name': name,
            'age': age,
            'breed': breed,
            'comments': comments,
            'author': author,
            'image_id': image_id
        })

        return jsonify(message='Cat added successfully'), 200

    except Exception as e:
        logging.error(f"Error adding cat: {e}")
        return jsonify(message='Error adding cat'), 500

@app.route('/deleteCat/<id>', methods=['DELETE', 'OPTIONS'])
def delete_cat(id):
    if request.method == 'OPTIONS':
        return '', 200  # Respond to preflight request

    try:
        db['cats'].delete_one({ '_id': ObjectId(id) })
        return jsonify(message='Cat deleted'), 200
    except Exception as e:
        logging.error(f"Error deleting cat: {e}")
        return jsonify(message='Error deleting cat'), 500


@app.route('/getAllCats', methods=['GET'])
def get_all_cats():
    try:
        cats = []
        for cat in db['cats'].find():
            image_file = fs.get(cat['image_id'])  # Retrieve image from GridFS
            image_data = image_file.read()
            image_base64 = base64.b64encode(image_data).decode('utf-8')

            cats.append({
                '_id': str(cat['_id']),
                'name': cat['name'],
                'age': cat['age'],
                'breed': cat['breed'],
                'comments': cat['comments'],
                'author': cat['author'],
                'image_base64': image_base64,
                'mime_type': image_file.content_type
            })
            print("Image MIME:", image_file.content_type)
            print("Image size:", len(image_data))


        return jsonify({'cats': cats}), 200
    except Exception as e:
        logging.error(f"Error retrieving cats: {e}")
        return jsonify(message='Error retrieving cats'), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)
