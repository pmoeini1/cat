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
            setCats(response.data.cats); // assuming your backend returns { cats: [...] }
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
        <div>
            <h2>View Cats</h2>
            {cats.map((cat, index) => (
                <div key={index}>
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
                    <button onClick={() => {
                        axios.delete(`http://localhost:5000/deleteCat/${cat._id}`)
                            .then(response => {
                                setMessage('Cat deleted successfully!');
                                fetchCats(); // Refresh the list after deletion
                            })
                            .catch(error => {
                                console.error('Error deleting cat:', error);
                                setMessage('Error deleting cat');
                            });
                    }}>Delete</button>
                    <hr />
                    
                </div>
            ))}
            <Link to="/addcat"><Button variant='secondary'>Add New Cat</Button></Link>
        </div>
    );
}

export default ViewCats;