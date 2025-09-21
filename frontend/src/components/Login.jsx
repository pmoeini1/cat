import React, { useState } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

 

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');


  const submit = () => {
    axios.post('http://localhost:5000/login', { username, password })
      .then(response => {
        console.log(response.data);
        // Handle successful login here
        setMessage('Login successful!');
        navigate('/dashboard'); // TODO: Redirect to main page
      })
      .catch(error => {
        console.error('There was an error logging in!', error);
        // Handle login error here
        setMessage('Login failed. Please check your credentials and try again.');
      }); 
    // Handle login logic here
    console.log('Logging in with', username, password);
  }

  return (
    <div>
      <h2>Login</h2>
      <h3>{message}</h3>
      <Form>
        <Form.Group controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        <Button variant="primary" type="submit" onClick={submit}>
          Submit
        </Button>
      </Form>
    </div>
      
  )
};

export default Login;