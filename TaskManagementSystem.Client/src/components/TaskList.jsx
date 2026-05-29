import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function TaskList() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. Unified function to load tasks from the API with Security Headers
    // useCallback prevents unnecessary re-renders
    const fetchTasks = useCallback(() => {
        const token = localStorage.getItem('token');

        axios.get('https://localhost:7216/api/Tasks', {
            headers: { 
                Authorization: `Bearer ${token}` 
            }
        })
        .then(response => {
            setTasks(response.data);
            setLoading(false);
        })
        .catch(err => {
            console.error("Error fetching tasks:", err);
            setLoading(false);
        });
    }, []);

    // 2. Load tasks when the component first opens
    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    // 3. Function to DELETE a task
    const handleDelete = (id) => {
        const token = localStorage.getItem('token');

        if (window.confirm("Are you sure you want to delete this task?")) {
            axios.delete(`https://localhost:7216/api/Tasks/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(() => {
                // Update local state immediately for better UX
                setTasks(prev => prev.filter(task => task.id !== id));
            })
            .catch(error => console.error("Error deleting task:", error));
        }
    };

    // 4. Function to UPDATE a task's status
    const handleStatusChange = (task, newStatus) => {
        const token = localStorage.getItem('token');
        // We only want to send the necessary fields to avoid conflicts
        const updatedTask = { ...task, status: newStatus };
        
        axios.put(`https://localhost:7216/api/Tasks/${task.id}`, updatedTask, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(() => {
            // Re-fetch to ensure the list matches the server state
            fetchTasks();
        })
        .catch(err => console.error("Error updating status:", err));
    };

    if (loading) {
        return <div style={{ padding: '20px', textAlign: 'center' }}>Loading your secure tasks...</div>;
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            
            {/* Header Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #1a1a1a', paddingBottom: '10px' }}>
                <h2 style={{ color: '#333', margin: 0 }}>My Tasks</h2>
                <Link to="/tasks/new" style={{ background: '#1a1a1a', color: 'white', padding: '8px 15px', textDecoration: 'none', borderRadius: '5px' }}>
                    + New Task
                </Link>
            </div>

            {/* List Section */}
            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {tasks.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                        <p>No tasks found for your account. Start by creating one!</p>
                    </div>
                ) : null}
                
                {tasks.map(task => (
                    <div key={task.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fafafa' }}>
                        
                        {/* Task Info */}
                        <div style={{ flex: 1 }}>
                            <h3 style={{ margin: '0 0 5px 0', color: '#1a1a1a' }}>{task.title}</h3>
                            <p style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}>{task.description}</p>
                            
                            <div style={{ display: 'flex', gap: '10px', fontSize: '12px', alignItems: 'center' }}>
                                <span style={{ background: '#e0e0e0', padding: '3px 8px', borderRadius: '12px', fontWeight: 'bold' }}>
                                    {task.priority} Priority
                                </span>
                                <span style={{ background: '#e0e0e0', padding: '3px 8px', borderRadius: '12px' }}>
                                    {task.category || 'Uncategorized'}
                                </span>
                                
                                {/* 👇 NEW: Dark Badge for User ID so Admins know who owns the task 👇 */}
                                <span style={{ background: '#1a1a1a', color: '#ffffff', padding: '3px 8px', borderRadius: '12px', fontWeight: 'bold' }}>
                                    User ID: {task.userId}
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end', marginLeft: '20px' }}>
                            <select 
                                value={task.status} 
                                onChange={(e) => handleStatusChange(task, e.target.value)}
                                style={{ padding: '6px', borderRadius: '4px', border: '1px solid #ccc', cursor: 'pointer' }}
                            >
                                <option value="Pending">Pending</option>
                                <option value="InProgress">In Progress</option>
                                <option value="Completed">Completed</option>
                            </select>
                            
                            <button 
                                onClick={() => handleDelete(task.id)} 
                                style={{ background: '#dc3545', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '13px' }}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}