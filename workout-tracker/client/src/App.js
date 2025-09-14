import React, { useState } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import './App.css';

function App() {

  // useState for changing page, setting user, and setting token
  const [page, nextpage] = useState('login');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // If the user is logged in, show the main dashboard
  if (user) {
    return <Dashboard user={user} token={token} setUser={setUser} />;
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Workout Tracky</h1>
        {page === 'login' ? (
          <Login setUser={setUser} setToken={setToken} nextpage={nextpage} />
        ) : (
          <Register nextpage={nextpage} />
        )}
      </header>
    </div>
  );
}

export default App;