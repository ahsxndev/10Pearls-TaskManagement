import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function TaskForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status: 'Pending',
        priority: 'Medium',
        category: '',
        dueDate: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // 1. Grab the VIP token from the browser's storage
        const token = localStorage.getItem('token');

        // 2. Post the new task with the Authorization Header
        axios.post('https://localhost:7216/api/Tasks', formData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            alert('Task Created Successfully!');
            navigate('/tasks'); 
        })
        .catch(error => {
            console.error("Error creating task:", error);
            alert('Failed to create task. Are you logged in?');
        });
    };

    return (
        <div style={{ maxWidth: '500px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            <h2>Create New Task</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                
                <input 
                    type="text" name="title" placeholder="Task Title" required
                    onChange={handleChange} 
                    style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                />
                
                <textarea 
                    name="description" placeholder="Description" rows="3"
                    onChange={handleChange}
                    style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                />

                <select name="priority" onChange={handleChange} style={{ padding: '10px', borderRadius: '5px' }}>
                    <option value="Low">Low Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="High">High Priority</option>
                </select>

                <input 
                    type="text" name="category" placeholder="Category (e.g., University, Project)" 
                    onChange={handleChange}
                    style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                />

                <input 
                    type="date" name="dueDate" required
                    onChange={handleChange}
                    style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                />

                <button type="submit" style={{ padding: '10px', background: '#1a1a1a', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    Save Task
                </button>
            </form>
        </div>
    );
}