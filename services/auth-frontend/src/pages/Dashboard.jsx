import React from 'react';

export default function Dashboard({ user }) {
  return (
    <div>
      <h2>Dashboard</h2>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}
