import React, { useState, useEffect } from 'react';
import axios from 'axios';


const ViewCats = () => {
    const [cats, setCats] = useState([]);
    const [message, setMessage] = useState('');

    const fetchCats = () => {
        axios.get('http://localhost:5000/getAllCats')
            .then(response => response.json())
            .then(data => {
                setCats(data.cats);
                setMessage('Cats fetched successfully!');
            }
            )
            .catch(error => {
                console.error('Error fetching cats:', error);
                setMessage('Error fetching cats');
            });
    }
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
        </div>
    );
}

export default ViewCats;