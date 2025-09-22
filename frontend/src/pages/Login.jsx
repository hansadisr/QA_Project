import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api, { setToken } from '../api';

export default function Login() {
  const nav = useNavigate();
  const [form, setForm] = useState({ email:'', password:'' });
  const [err, setErr] = useState('');

  const login = async () => {
    setErr('');
    try {
      const { data } = await api.post('/api/auth/login', form);
      setToken(data.token);
      nav('/');
    } catch (e) {
      setErr(e?.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div style={{maxWidth:420, margin:'40px auto', fontFamily:'system-ui'}}>
      <h2>Login</h2>
      {err && <div style={{color:'crimson', marginBottom:8}}>{err}</div>}
      <input
        placeholder="Email"
        value={form.email}
        onChange={e=>setForm({...form, email:e.target.value})}
        style={{width:'100%', marginBottom:8, padding:8}}
        data-testid="login-email"
      />
      <input
        placeholder="Password"
        type="password"
        value={form.password}
        onChange={e=>setForm({...form, password:e.target.value})}
        style={{width:'100%', marginBottom:12, padding:8}}
        data-testid="login-password"
      />
      <button id="loginBtn" onClick={login} data-testid="login-submit">Login</button>
      {/* Keep this for your Selenium tests: “Create account” button navigates to Signup */}
      <span style={{marginLeft:10}}>
        or <Link to="/signup" data-testid="nav-signup">Create account</Link>
      </span>
    </div>
  );
}
