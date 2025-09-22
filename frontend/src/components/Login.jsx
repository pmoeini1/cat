import React, { useState } from 'react';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

 

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');


  const submit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/login', { email: username, password: password })
      .then(response => {
        console.log(response.data);
        // Handle successful login here
        setMessage('Login successful!');
        //navigate('/dashboard'); // TODO: Redirect to main page
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
      <Form onSubmit={submit}>
        <Form.Group controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter email"
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
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
      
  )
};

export default Login;