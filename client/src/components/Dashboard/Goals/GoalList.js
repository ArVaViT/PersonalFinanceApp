// src/components/Dashboard/Goals/GoalList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from '../../../styles/GoalList.module.css';

const GoalList = () => {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchGoals = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                };
                const res = await axios.get('https://my-personal-finance-app-1e2eb0485e32.herokuapp.com/api/goals', config);
                setGoals(res.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch goals. Please try again.');
                setLoading(false);
            }
        };

        fetchGoals();
    }, []);

    const deleteGoal = async id => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            };
            await axios.delete(`https://my-personal-finance-app-1e2eb0485e32.herokuapp.com/api/goals/${id}`, config);
            setGoals(goals.filter(goal => goal._id !== id));
        } catch (err) {
            setError('Failed to delete goal. Please try again.');
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    return (
        <div className={styles.goalList}>
            <h2>Goals</h2>
            <Link to="/goals/create">Create New Goal</Link>
            <ul>
                {goals.map(goal => (
                    <li key={goal._id}>
                        {goal.name} - Target Amount: {goal.targetAmount}, Current Amount: {goal.currentAmount}
                        <Link to={`/goals/${goal._id}`}>Edit</Link>
                        <button onClick={() => deleteGoal(goal._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GoalList;
