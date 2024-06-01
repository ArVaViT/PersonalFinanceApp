// src/components/Dashboard/Goals/GoalForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import styles from '../../../styles/GoalForm.module.css';

const GoalForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        targetAmount: '',
        currentAmount: '',
        deadline: ''
    });
    const [error, setError] = useState('');
    const history = useHistory();

    const { name, targetAmount, currentAmount, deadline } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            };
            await axios.post('https://personal-finance-app-rngp.vercel.app/api/goals/create', formData, config);
            history.push('/goals'); // Перенаправление на страницу списка целей после создания
        } catch (err) {
            setError('Failed to create goal. Please try again.');
        }
    };

    return (
        <div className={styles.goalForm}>
            <h2>Create Goal</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={onSubmit}>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input type="text" name="name" value={name} onChange={onChange} required />
                </div>
                <div>
                    <label htmlFor="targetAmount">Target Amount:</label>
                    <input type="number" name="targetAmount" value={targetAmount} onChange={onChange} required />
                </div>
                <div>
                    <label htmlFor="currentAmount">Current Amount:</label>
                    <input type="number" name="currentAmount" value={currentAmount} onChange={onChange} />
                </div>
                <div>
                    <label htmlFor="deadline">Deadline:</label>
                    <input type="date" name="deadline" value={deadline} onChange={onChange} />
                </div>
                <button type="submit">Create Goal</button>
            </form>
        </div>
    );
};

export default GoalForm;
