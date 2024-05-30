// src/components/Dashboard/Reminders/ReminderDetails.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';
import styles from '../../../styles/ReminderDetails.module.css';

const ReminderDetails = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        time: '',
        recurring: false
    });
    const [error, setError] = useState('');
    const history = useHistory();

    useEffect(() => {
        const fetchReminder = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                };
                const res = await axios.get(`http://localhost:5000/api/reminders/${id}`, config);
                setFormData(res.data);
            } catch (err) {
                setError('Failed to fetch reminder. Please try again.');
            }
        };

        fetchReminder();
    }, [id]);

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
            await axios.put(`http://localhost:5000/api/reminders/${id}`, formData, config);
            history.push('/reminders'); // Перенаправление на страницу списка напоминаний после обновления
        } catch (err) {
            setError('Failed to update reminder. Please try again.');
        }
    };

    return (
        <div className={styles.reminderDetails}>
            <h2>Update Reminder</h2>
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
                <button type="submit">Update Reminder</button>
            </form>
        </div>
    );
};

export default ReminderDetails;
