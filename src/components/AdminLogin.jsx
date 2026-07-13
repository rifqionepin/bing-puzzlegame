import { useState } from 'react'

const ADMIN_USER = 'admin'
const ADMIN_PASS = 'admin123'

export default function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      onLogin()
    } else {
      setError('Invalid credentials')
    }
  }

  return (
    <div className="admin-login">
      <form className="admin-login-card" onSubmit={handleSubmit}>
        <h1>Admin Login</h1>
        {error && <div className="admin-login-error">{error}</div>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          autoFocus
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  )
}
