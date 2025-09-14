import React, { useState } from 'react';
import axios from 'axios';

function Register({ nextpage }) {

  // useState for setting user, email, and password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user_name, setUser_name] = useState('');

  // useState for the program to know the loading state, success state and the error state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents page from refreshing
    setLoading(true); // Setting loading status to true
    setError(''); // Setting error back to nothing incase it was changed
    setSuccess(''); // Setting success back to nothing for now

    try {

      // Connecting frontend login.js to register endpoint in the backend
      const response = await axios.post('http://localhost:5000/api/register', {
        email,
        password,
        user_name
      });

      // Set the success as the success message if succesful 
      setSuccess("Account Created! You can now login!")

      // Clear the form to show the account is now created and completed.
      setEmail("")
      setPassword("")
      setUser_name("")

    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <label>Enter your email, Username and Password!</label>
        <div>
          <input
          type = "text"
          placeholder = "User-Name"
          value = {user_name}
          onChange = {(e) => setUser_name(e.target.value)}
          />
        </div>
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
              {loading ? 'Registering Account...' : 'Register'}
          </button>
        </div>
        {error && <div style={{color: 'red'}}>{error}</div>}
        {success && <div style={{color: 'green'}}>{success}</div>}
        <p>
          Login instead?{' '}
          <div>
            <button type="button" onClick={() => nextpage('login')}>
              Login
            </button>
          </div>
        </p>
      </form>
    </div>

  );
}

export default Register;