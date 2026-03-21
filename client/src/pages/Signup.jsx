import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Signup() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    setLoading(true);
    
    try {
      await register({
        email: formData.email,
        password: formData.password
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
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
              <div className={`input-wrapper ${formData.email ? '' : 'empty'}`}>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="email">Email address</label>
              </div>
            </div>

            <div className="form-group">
              <div className={`input-wrapper ${formData.password ? '' : 'empty'}`}>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <label htmlFor="password">Password</label>
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading || !formData.email || !formData.password}
            >
              {loading ? 'Saving...' : 'Sign Up'}
            </button>

            <div className="divider">
              <span>or</span>
            </div>

            <Link to="/login" className="btn btn-secondary" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
              Log In
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
          <a href="#">Contact Us</a>
          <a href="#">Privacy</a>
          <a href="#">Legal</a>
          <a href="#">Worldwide</a>
        </div>
      </footer>
    </div>
  );
}

export default Signup;
