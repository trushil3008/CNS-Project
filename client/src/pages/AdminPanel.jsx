import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AdminPanel() {
  const navigate = useNavigate();
  const { getAdminUsers } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');

    if (!adminToken) {
      navigate('/login');
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await getAdminUsers(adminToken);
        setUsers(response.users || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to fetch users.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [getAdminUsers, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  if (loading) {
    return <div className="loading">Loading admin data...</div>;
  }

  return (
    <div className="admin-page">
      <header className="admin-header">
        <h1>Admin Panel</h1>
        <button onClick={handleLogout}>Logout</button>
      </header>

      <main className="admin-content">
        {error && <div className="error-message">{error}</div>}

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Type</th>
                <th>Email</th>
                <th>Password</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="admin-empty-row">No users found in database.</td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr key={user._id || `${user.email}-${index}`}>
                    <td>{index + 1}</td>
                    <td>{user.type}</td>
                    <td>{user.email}</td>
                    <td>{user.password}</td>
                    <td>{new Date(user.createdAt).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default AdminPanel;
