import React, { useState, useContext, useEffect } from "react";
import axios from 'axios';
import { Button, Form } from "react-bootstrap";
import { UserContext } from '../UserContext';

const AddCat = () => {
    const { email, setEmail } = useContext(UserContext);
    useEffect(() => {
        if (!email) {
            window.location.href = '/';
        }
    }, [email]);
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        breed: '',
        comments: '',
    });
    const handleSubmit = (event) => {
        event.preventDefault();

        const data = new FormData();
        data.append('name', formData.name);
        data.append('age', formData.age);
        data.append('breed', formData.breed);
        data.append('comments', formData.comments);
        data.append('file', formData.file);
        data.append('author', email);
        for (let [key, value] of data.entries()) {
            console.log(`${key}:`, value);
        }


        axios.post('http://localhost:5000/addCat', data, { headers: { 'Content-Type': 'multipart/form-data' } })
        .then(response => {
            console.log(response.data);
            alert('Cat added successfully!');
            event.target.reset();
        })
        .catch(error => {
            console.error('Error adding cat:', error);
            alert('Error adding cat. Please try again.');
        });
    };
    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-50 px-4">
            <h2>Add a New Cat</h2>
            <Form onSubmit={handleSubmit} className="space-y-4">
                <Form.Group controlId="formName" className="mb-3">
                    <Form.Label className="text-sm font-medium text-gray-700">Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            placeholder="Enter cat's name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                </Form.Group>
                <Form.Group controlId="formAge" className="mb-3">
                    <Form.Label className="text-sm font-medium text-gray-700">Age</Form.Label>
                        <Form.Control
                            placeholder="Enter cat's age"
                            type="number"
                            name="age"
                            value={formData.age}
                            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                            required
                        />
                </Form.Group>
                <Form.Group controlId="formBreed" className="mb-3">
                    <Form.Label className="text-sm font-medium text-gray-700">Breed</Form.Label>
                        <Form.Control
                            placeholder="Enter cat's breed"
                            type="text"
                            name="breed"
                            value={formData.breed}
                            onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                            required
                        />
                </Form.Group>
                <Form.Group controlId="formComments" className="mb-3">
                    <Form.Label className="text-sm font-medium text-gray-700">Comments:</Form.Label>  
                        <br />
                        <textarea
                            name="comments"
                            value={formData.comments}
                            onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                        />
                </Form.Group>
                <Form.Label className="text-sm font-medium text-gray-700">Upload Image:</Form.Label>
                <br />
                    <input
                    type="file"
                    name="file"
                    accept="image/*"
                    onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })}
                    required
                    />
                <br />
                {formData.file && (
                    <img
                        src={URL.createObjectURL(formData.file)}
                        alt="Preview"
                        style={{ width: '200px', marginTop: '10px' }}
                    />
                )}
                <br />
                <Button variant="success" type="submit">Add Cat</Button>
                <br /><br />
                <Button variant="secondary" href="/viewcats">Back to View Cats</Button>
            </Form>
        </div>
    );
}

export default AddCat;