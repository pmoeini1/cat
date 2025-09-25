import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { UserContext } from '../UserContext';
import { useNavigate } from 'react-router-dom';

const ViewCats = () => {
    const { email, setEmail } = useContext(UserContext);
    const [cats, setCats] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (!email) {
            window.location.href = '/';
        }
    }, [email]);

    const fetchCats = () => {
        axios.get('http://localhost:5000/getAllCats')
            .then(response => {
            setCats(response.data.cats); 
            setMessage('Cats fetched successfully!');
            })
            .catch(error => {
            console.error('Error fetching cats:', error);
            setMessage('Error fetching cats');
            });
    };
    useEffect(() => {
        fetchCats();
    }, []);
    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-50 px-4">
            <h2 className="text-2xl font-semibold mb-4">View Cats</h2>

            <div className="flex flex-row flex-wrap justify-center gap-6 mb-6">

            {cats.map((cat, index) => (
                <div className="w-64 text-center" key={index}>
                <img
                    src={`data:${cat.mime_type};base64,${cat.image_base64}`}
                    alt={`Image of ${cat.name}`}
                    style={{ width: '200px', height: 'auto', objectFit: 'cover' }}
                />
                <h3>{cat.name}</h3>
                <p>Age: {cat.age}</p>
                <p>Breed: {cat.breed}</p>
                <p>Comments: {cat.comments}</p>
                <p>Posted by: {cat.author}</p>
                {email === cat.author? <Button
                    variant="danger"
                    onClick={() => {
                    axios
                        .delete(`http://localhost:5000/deleteCat/${cat._id}`)
                        .then(response => {
                        setMessage('Cat deleted successfully!');
                        fetchCats();
                        })
                        .catch(error => {
                        console.error('Error deleting cat:', error);
                        setMessage('Error deleting cat');
                        });
                    }}
                >
                    Delete
                </Button>:null}
                <hr />
                </div>
            ))}
            </div>

            <Link to="/addcat">
            <Button variant="secondary">Add New Cat</Button>
            </Link>
        </div>
    );
}

export default ViewCats;