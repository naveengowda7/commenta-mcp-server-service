// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App

import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import API from './services/api';

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    API.get('/auth/me').then(res => setUser(res.data.user)).catch(() => setUser(null));
  }, []);

  const logout = async () => {
    await API.post('/auth/logout');
    setUser(null);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem' }}>
  <nav>
    <a href="/">Home</a>
    {!user && <a href="/register">Register</a>}
    {!user && <a href="/login">Login</a>}
    {user && <a href="/dashboard">Dashboard</a>}
    {user && <button onClick={logout}>Logout</button>}
  </nav>

  <div style={{ padding: '1rem' }}>
    <Routes>
      <Route path="/" element={<Home user={user} />} />
      <Route path="/register" element={!user ? <Register onAuth={setUser}/> : <Navigate to="/dashboard"/>} />
      <Route path="/login" element={!user ? <Login onAuth={setUser}/> : <Navigate to="/dashboard"/>} />
      <Route path="/dashboard" element={<Protected user={user}><Dashboard user={user}/></Protected>} />
    </Routes>
  </div>
</div>

  );
}

function Home({ user }) {
  return <h2>{user ? `Hello ${user.name}` : "Not logged in"}</h2>;
}

function Protected({ user, children }) {
  if (!user) return <Navigate to="/login" />;
  return children;
}
