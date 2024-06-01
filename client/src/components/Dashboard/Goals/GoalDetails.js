// src/components/Dashboard/Goals/GoalDetails.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';
import styles from '../../../styles/GoalDetails.module.css';

const GoalDetails = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        name: '',
        targetAmount: '',
        currentAmount: '',
        deadline: ''
    });
    const [error, setError] = useState('');
    const history = useHistory();

    useEffect(() => {
        const fetchGoal = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                };
                const res = await axios.get(`https://personal-finance-app-rngp.vercel.app/api/goals/${id}`, config);
                setFormData(res.data);
            } catch (err) {
                setError('Failed to fetch goal. Please try again.');
            }
        };

        fetchGoal();
    }, [id]);

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
            await axios.put(`https://personal-finance-app-rngp.vercel.app/api/goals/${id}`, formData, config);
            history.push('/goals'); // Перенаправление на страницу списка целей после обновления
        } catch (err) {
            setError('Failed to update goal. Please try again.');
        }
    };

    return (
        <div className={styles.goalDetails}> 
            <h2>Update Goal</h2>
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
                <button type="submit">Update Goal</button>
            </form>
        </div>
    );
};

export default GoalDetails;
