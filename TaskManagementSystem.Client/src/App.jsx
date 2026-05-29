import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';

// --- The Bouncer ---
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to="/" replace />;
    }
    return children;
};

// --- The Smart Navigation Bar ---
const Navigation = () => {
    const navigate = useNavigate();
    const location = useLocation(); // 👈 This grabs the current URL path
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    // If logged out, render absolutely nothing for the navbar
    if (!token) return null;

    return (
        <nav style={navStyle}>
            <div style={{ display: 'flex', gap: '40px', alignItems: 'center' }}>
                <h3 style={brandStyle}>10Pearls SHINE</h3>
                
                <div style={{ display: 'flex', gap: '25px', paddingTop: '4px' }}>
                    <Link 
                        to="/dashboard" 
                        style={location.pathname === '/dashboard' ? activeLinkStyle : inactiveLinkStyle}
                    >
                        Dashboard
                    </Link>
                    <Link 
                        to="/tasks" 
                        // This keeps the Task tab lit up even if you are on the "New Task" screen
                        style={location.pathname.includes('/tasks') ? activeLinkStyle : inactiveLinkStyle}
                    >
                        Task List
                    </Link>
                </div>
            </div>
            
            <button onClick={handleLogout} style={logoutButtonStyle}>
                Logout
            </button>
        </nav>
    );
};

// --- The Main App Container ---
export default function App() {
    return (
        <BrowserRouter>
            <Navigation />
            <div style={{ padding: '30px', background: '#f5f5f5', minHeight: '100vh' }}>
                <Routes>
                    <Route path="/" element={<Login />} />
                    
                    <Route path="/dashboard" element={
                        <ProtectedRoute><Dashboard /></ProtectedRoute>
                    } />
                    
                    <Route path="/tasks" element={
                        <ProtectedRoute><TaskList /></ProtectedRoute>
                    } />
                    
                    <Route path="/tasks/new" element={
                        <ProtectedRoute><TaskForm /></ProtectedRoute>
                    } />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

// --- Cinematic Noir Styling ---
const navStyle = {
    background: '#000000', // Pitch black
    padding: '18px 40px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid #222',
    boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
};

const brandStyle = { 
    margin: 0, 
    color: '#ffffff', 
    letterSpacing: '1px', 
    fontWeight: '700',
    fontSize: '20px'
};

const inactiveLinkStyle = { 
    color: '#666666', 
    textDecoration: 'none', 
    fontSize: '15px', 
    fontWeight: '500',
    transition: 'color 0.2s ease-in-out' 
};

const activeLinkStyle = { 
    color: '#ffffff', 
    textDecoration: 'none', 
    fontSize: '15px', 
    fontWeight: '600', 
    borderBottom: '2px solid #ffffff', 
    paddingBottom: '6px' 
};

const logoutButtonStyle = {
    background: 'transparent',
    color: '#666666',
    border: '1px solid #333',
    padding: '6px 16px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: '600',
    transition: 'all 0.2s'
};