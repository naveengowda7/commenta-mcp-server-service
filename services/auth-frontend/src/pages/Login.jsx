import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Login({ onAuth }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const nav = useNavigate();

  const submit = async e => {
    e.preventDefault();
    const res = await API.post('/auth/login', form);
    onAuth(res.data.user);
    nav('/dashboard');
  };

  return (
    <form onSubmit={submit}>
      <input placeholder="Email" onChange={e => setForm({...form, email: e.target.value})} />
      <input type="password" placeholder="Password" onChange={e => setForm({...form, password: e.target.value})} />
      <button>Login</button>
    </form>
  );
}
