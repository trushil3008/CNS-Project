import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const response = await login(email, password);

      if (response?.isAdmin && response?.adminToken) {
        localStorage.setItem('adminToken', response.adminToken);
        navigate('/admin');
        return;
      }

      localStorage.removeItem('adminToken');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save login details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <main className="auth-main">
        <div className="auth-card">
          <div className="logo">
            <h1>Pay<span>Pal</span></h1>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <div className={`input-wrapper ${email ? '' : 'empty'}`}>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
                <label htmlFor="email">Email</label>
              </div>
            </div>

            <div className="form-group">
              <div className={`input-wrapper ${password ? '' : 'empty'}`}>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <label htmlFor="password">Password</label>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading || !email || !password}
            >
              {loading ? 'Saving...' : 'Log In'}
            </button>

            <div className="divider">
              <span>or</span>
            </div>

            <Link to="/signup" className="btn btn-secondary" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
              Sign Up
            </Link>
          </form>

          <div className="country-selector">
            <span>🇮🇳</span>
            <svg viewBox="0 0 24 24">
              <path d="M7 10l5 5 5-5z"/>
            </svg>
          </div>
        </div>
      </main>

      <footer className="auth-footer">
        <div className="footer-links">
          <a href="https://www.paypal.com/in/cshelp/contact-us">Contact Us</a>
          <a href="https://www.paypal.com/in/legalhub/paypal/privacy-full">Privacy</a>
          <a href="https://www.paypal.com/in/legalhub/paypal/home">Legal</a>
          <a href="https://www.paypal.com/in/webapps/mpp/country-worldwide">Worldwide</a>
        </div>
      </footer>
    </div>
  );
}

export default Login;
