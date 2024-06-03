// src/components/Auth/RegisterForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: ''
    });
    const [error, setError] = useState('');
    const history = useHistory();

    const { name, email, password, password2 } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        if (password !== password2) {
            setError('Passwords do not match');
        } else {
            try {
                await axios.post('https://my-personal-finance-app-1e2eb0485e32.herokuapp.com/api/auth/register', formData);
                history.push('/'); // Перенаправление на страницу логина после успешной регистрации
            } catch (err) {
                if (err.response && err.response.data && err.response.data.errors) {
                    setError(err.response.data.errors[0].msg);
                } else {
                    setError('Registration failed. Please try again.');
                }
            }
        }
    };

    return (
        <div>
            <h2>Register</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={onSubmit}>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input type="text" name="name" value={name} onChange={onChange} required />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input type="email" name="email" value={email} onChange={onChange} required />
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input type="password" name="password" value={password} onChange={onChange} required />
                </div>
                <div>
                    <label htmlFor="password2">Confirm Password:</label>
                    <input type="password" name="password2" value={password2} onChange={onChange} required />
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default RegisterForm;
