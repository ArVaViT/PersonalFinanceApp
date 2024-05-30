// src/components/Dashboard/Categories/CategoryDetails.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';
import styles from '../../../styles/CategoryDetails.module.css';

const CategoryDetails = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        name: '',
        type: ''
    });
    const [error, setError] = useState('');
    const history = useHistory();

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                };
                const res = await axios.get(`http://localhost:5000/api/categories/${id}`, config);
                setFormData(res.data);
            } catch (err) {
                setError('Failed to fetch category. Please try again.');
            }
        };

        fetchCategory();
    }, [id]);

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
            await axios.put(`http://localhost:5000/api/categories/${id}`, formData, config);
            history.push('/categories'); // Перенаправление на страницу списка категорий после обновления
        } catch (err) {
            setError('Failed to update category. Please try again.');
        }
    };

    return (
        <div className={styles.categoryDetails}> 
            <h2>Update Category</h2>
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
                <button type="submit">Update Category</button>
            </form>
        </div>
    );
};

export default CategoryDetails;
