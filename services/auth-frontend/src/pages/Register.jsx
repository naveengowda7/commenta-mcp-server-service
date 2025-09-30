import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Register({ onAuth }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const nav = useNavigate();

  const submit = async e => {
    e.preventDefault();
    const res = await API.post('/auth/register', form);
    onAuth(res.data.user);
    nav('/dashboard');
  };

  return (
    <form onSubmit={submit}>
      <input placeholder="Name" onChange={e => setForm({...form, name: e.target.value})} />
      <input placeholder="Email" onChange={e => setForm({...form, email: e.target.value})} />
      <input type="password" placeholder="Password" onChange={e => setForm({...form, password: e.target.value})} />
      <button>Register</button>
    </form>
  );
}
