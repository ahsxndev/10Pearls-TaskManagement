import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    const token = localStorage.getItem('token'); // 👈 Get the badge

    axios.get('https://localhost:7216/api/Tasks', {
        headers: { Authorization: `Bearer ${token}` } // 👈 Show the badge
    })
    .then(response => {
        setTasks(response.data);
        setLoading(false);
    })
    .catch(error => {
        console.error("Dashboard fetch error:", error);
        setLoading(false);
    });
}, []);

    // Calculate our stats
    const pendingCount = tasks.filter(task => task.status === 'Pending').length;
    const inProgressCount = tasks.filter(task => task.status === 'InProgress').length;
    const completedCount = tasks.filter(task => task.status === 'Completed').length;

    if (loading) return <div style={{ padding: '20px' }}>Loading dashboard...</div>;

    return (
        <div style={{ fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ color: '#333', borderBottom: '2px solid #1a1a1a', paddingBottom: '10px' }}>
                System Overview
            </h2>
            
            <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
                {/* Pending Card */}
                <div style={cardStyle}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#888' }}>Pending</h3>
                    <p style={{ fontSize: '36px', margin: '0', fontWeight: 'bold' }}>{pendingCount}</p>
                </div>

                {/* In Progress Card */}
                <div style={cardStyle}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#888' }}>In Progress</h3>
                    <p style={{ fontSize: '36px', margin: '0', fontWeight: 'bold' }}>{inProgressCount}</p>
                </div>

                {/* Completed Card */}
                <div style={cardStyle}>
                    <h3 style={{ margin: '0 0 10px 0', color: '#888' }}>Completed</h3>
                    <p style={{ fontSize: '36px', margin: '0', fontWeight: 'bold' }}>{completedCount}</p>
                </div>
            </div>
        </div>
    );
}

// Minimalist stealth black styling for the stat cards
const cardStyle = {
    flex: 1,
    background: '#1a1a1a',
    color: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    textAlign: 'center'
};