import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">
          Blog<span>Sphere</span>
        </Link>

        <nav className="navbar-links">
          <Link to="/">Home</Link>
          {isAuthenticated ? (
            <>
              <Link to="/create" className="btn-ghost">
                + New Post
              </Link>
              <span className="navbar-user">Hi, {user?.username}</span>
              <button className="btn-ghost" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register" className="btn-ghost">
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
