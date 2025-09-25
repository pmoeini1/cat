import React, { useState, useContext } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { email, setEmail } = useContext(UserContext);

  const submit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/login', { email: username, password: password })
      .then(response => {
        console.log(response.data);
        setMessage('Login successful!');
        setEmail(username);
        navigate('/viewcats');
      })
      .catch(error => {
        console.error('There was an error logging in!', error);
        setMessage('Login failed. Please check your credentials and try again.');
      });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">Login</h2>
        {message && (
          <Alert variant="info" className="text-center mb-4">
            {message}
          </Alert>
        )}
        <Form onSubmit={submit} className="space-y-4">
          <Form.Group controlId="formEmail">
            <Form.Label className="text-sm font-medium text-gray-700">Email</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formPassword">
            <Form.Label className="text-sm font-medium text-gray-700">Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <br />
          <div className="flex justify-center">
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;