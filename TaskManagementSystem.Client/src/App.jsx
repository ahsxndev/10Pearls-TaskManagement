import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import TaskList from './components/TaskList';
import TaskDetail from './components/TaskDetail';
import TaskForm from './components/TaskForm';

function App() {
  return (
    <BrowserRouter>
      {/* Temporary Navigation Menu */}
      <nav style={{ padding: '10px', background: '#1a1a1a', color: 'white', marginBottom: '20px' }}>
        <Link to="/" style={{ color: 'white', marginRight: '15px' }}>Dashboard</Link>
        <Link to="/tasks" style={{ color: 'white', marginRight: '15px' }}>Task List</Link>
        <Link to="/login" style={{ color: 'white' }}>Login</Link>
      </nav>

      {/* The Routes */}
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/tasks" element={<TaskList />} />
          <Route path="/tasks/:id" element={<TaskDetail />} />
          <Route path="/tasks/new" element={<TaskForm />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;