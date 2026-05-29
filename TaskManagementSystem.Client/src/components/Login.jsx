import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        
        // 1. Send login credentials to C#
        axios.post('https://localhost:7216/api/Auth/login', { email, password })
            .then(response => {
                // 2. Grab the JWT token from the response and save it to the browser
                const token = response.data.token;
                localStorage.setItem('token', token);
                
                alert('Login Successful!');
                navigate('/tasks'); // Send them to the task list
            })
            .catch(err => {
                setError('Invalid email or password');
                console.error(err);
            });
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', fontFamily: 'sans-serif' }}>
            <h2 style={{ textAlign: 'center' }}>System Login</h2>
            
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input 
                    type="email" placeholder="Email Address" required
                    value={email} onChange={e => setEmail(e.target.value)}
                    style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                />
                
                <input 
                    type="password" placeholder="Password" required
                    value={password} onChange={e => setPassword(e.target.value)}
                    style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                />

                <button type="submit" style={{ padding: '10px', background: '#1a1a1a', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    Login
                </button>
            </form>
        </div>
    );
}