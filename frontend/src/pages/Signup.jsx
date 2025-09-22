import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

export default function Signup() {
  const nav = useNavigate();
  const [form, setForm] = useState({ name:'', email:'', password:'' });
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');

  const signup = async () => {
    setErr(''); setOk('');
    try {
      await api.post('/api/auth/signup', form);
      setOk('Signup successful! Please login.');
      setTimeout(()=>nav('/login'), 600);
    } catch (e) {
      setErr(e?.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <div style={{maxWidth:420, margin:'40px auto', fontFamily:'system-ui'}}>
      <h2>Signup</h2>
      {err && <div style={{color:'crimson', marginBottom:8}}>{err}</div>}
      {ok && <div style={{color:'green', marginBottom:8}}>{ok}</div>}
      <input
        placeholder="Name"
        value={form.name}
        onChange={e=>setForm({...form, name:e.target.value})}
        style={{width:'100%', marginBottom:8, padding:8}}
        data-testid="signup-name"
      />
      <input
        placeholder="Email"
        value={form.email}
        onChange={e=>setForm({...form, email:e.target.value})}
        style={{width:'100%', marginBottom:8, padding:8}}
        data-testid="signup-email"
      />
      <input
        placeholder="Password"
        type="password"
        value={form.password}
        onChange={e=>setForm({...form, password:e.target.value})}
        style={{width:'100%', marginBottom:12, padding:8}}
        data-testid="signup-password"
      />
      {/* Keep exact text “Create Account” for your existing Selenium test */}
      <button onClick={signup} data-testid="signup-submit">Create Account</button>
      <span style={{marginLeft:10}}>
        or <Link to="/login">Back to Login</Link>
      </span>
    </div>
  );
}
