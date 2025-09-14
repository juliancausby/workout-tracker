import React, { useState } from 'react';
import axios from 'axios';

function Login({ setUser, setToken, nextpage }) {

  // useState for setting email and password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // useState for the program to know the loading state and the error state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handles the button from the login
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents page from refreshing
    setLoading(true); // Setting loading status to true
    setError(''); // Setting error back to nothing incase it was changed

    try {

      // Connecting frontend login.js to login endpoint in the backend
      const response = await axios.post('http://localhost:5000/api/login', {
        email,
        password
      });
  
      // If these are set, the app will showcase dashboard
      setUser(response.data.user);
      setToken(response.data.token);
      
  
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>Enter your email and password!</label>
          <div>
            <input
              type = "email"
              placeholder = "Email"
              value = {email}
              onChange = {(e) => setEmail(e.target.value)}
            />
        </div> 
        <div>
          <input
            type = "password"
            placeholder = "Password"
            value = {password}
            onChange = {(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <button type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
        {error && <div style={{color: 'red'}}>{error}</div>}
        <p>
          Sign up now!{' '}
          <div>
            <button type="button" onClick={() => nextpage('register')}>
              Register
            </button>
          </div>
        </p>
      </form>
    </div>
  );
};

export default Login;