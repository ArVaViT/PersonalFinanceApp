// src/components/Dashboard/Reminders/ReminderList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from '../../../styles/ReminderList.module.css';

const ReminderList = () => {
    const [reminders, setReminders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchReminders = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                };
                const res = await axios.get('https://personal-finance-app-rngp.vercel.app/api/reminders', config);
                setReminders(res.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch reminders. Please try again.');
                setLoading(false);
            }
        };

        fetchReminders();
    }, []);

    const deleteReminder = async id => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            };
            await axios.delete(`https://personal-finance-app-rngp.vercel.app/api/reminders/${id}`, config);
            setReminders(reminders.filter(reminder => reminder._id !== id));
        } catch (err) {
            setError('Failed to delete reminder. Please try again.');
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    return (
        <div className={styles.reminderList}>
            <h2>Reminders</h2>
            <Link to="/reminders/create">Create New Reminder</Link>
            <ul>
                {reminders.map(reminder => (
                    <li key={reminder._id}>
                        {reminder.title} - Date: {new Date(reminder.date).toLocaleDateString()}, Time: {reminder.time}
                        <Link to={`/reminders/${reminder._id}`}>Edit</Link>
                        <button onClick={() => deleteReminder(reminder._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ReminderList;
