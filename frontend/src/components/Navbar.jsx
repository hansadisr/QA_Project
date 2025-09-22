import { Link, useNavigate } from 'react-router-dom';
import { getToken, setToken } from '../api';

export default function Navbar() {
  const nav = useNavigate();
  const authed = !!getToken();

  const logout = () => {
    setToken(null);
    nav('/login');
  };

  const linkStyle = { marginRight: 12, textDecoration: 'none', color: '#0366d6' };

  return (
    <div style={{
      display:'flex', alignItems:'center', justifyContent:'space-between',
      padding:'12px 16px', borderBottom:'1px solid #eee', fontFamily:'system-ui'
    }}>
      <div>
        <Link to="/" style={{...linkStyle, fontWeight:'700', color:'#111'}}>Tasky</Link>
      </div>
      <div>
        {authed ? (
          <>
            <Link to="/" style={linkStyle}>Home</Link>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            {/* “Login” and “Signup” in navbar as you asked */}
            <Link to="/login" style={linkStyle} data-testid="nav-login">Login</Link>
            <Link to="/signup" style={linkStyle}data-testid="nav-signup">Signup</Link>
          </>
        )}
      </div>
    </div>
  );
}
