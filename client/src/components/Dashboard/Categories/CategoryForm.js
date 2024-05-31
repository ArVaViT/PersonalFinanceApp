// src/components/Dashboard/Categories/CategoryForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import styles from '../../../styles/CategoryForm.module.css';

const CategoryForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        type: ''
    });
    const [error, setError] = useState('');
    const history = useHistory();

    const { name, type } = formData;

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
            await await axios.post('https://personal-finance-app-rngp.vercel.app/api/categories/create', formData, config);
            history.push('/categories'); // Перенаправление на страницу списка категорий после создания
        } catch (err) {
            setError('Failed to create category. Please try again.');
        }
    };

    return (
        <div className={styles.categoryForm}>
            <h2>Create Category</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={onSubmit}>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input type="text" name="name" value={name} onChange={onChange} required />
                </div>
                <div>
                    <label htmlFor="type">Type:</label>
                    <select name="type" value={type} onChange={onChange} required>
                        <option value="">Select Type</option>
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
                    </select>
                </div>
                <button type="submit">Create Category</button>
            </form>
        </div>
    );
};

export default CategoryForm;
