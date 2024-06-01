// src/components/Dashboard/Reminders/ReminderForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import styles from '../../../styles/ReminderForm.module.css';

const ReminderForm = () => {
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        time: '',
        recurring: false
    });
    const [error, setError] = useState('');
    const history = useHistory();

    const { title, date, time, recurring } = formData;

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
            await axios.post('https://personal-finance-app-rngp.vercel.app/api/reminders/create', formData, config);
            history.push('/reminders'); // Перенаправление на страницу списка напоминаний после создания
        } catch (err) {
            setError('Failed to create reminder. Please try again.');
        }
    };

    return (
        <div className={styles.reminderForm}>
            <h2>Create Reminder</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={onSubmit}>
                <div>
                    <label htmlFor="title">Title:</label>
                    <input type="text" name="title" value={title} onChange={onChange} required />
                </div>
                <div>
                    <label htmlFor="date">Date:</label>
                    <input type="date" name="date" value={date} onChange={onChange} required />
                </div>
                <div>
                    <label htmlFor="time">Time:</label>
                    <input type="time" name="time" value={time} onChange={onChange} required />
                </div>
                <div>
                    <label htmlFor="recurring">Recurring:</label>
                    <input type="checkbox" name="recurring" checked={recurring} onChange={() => setFormData({ ...formData, recurring: !recurring })} />
                </div>
                <button type="submit">Create Reminder</button>
            </form>
        </div>
    );
};

export default ReminderForm;
