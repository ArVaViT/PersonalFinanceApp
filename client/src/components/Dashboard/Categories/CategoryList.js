// src/components/Dashboard/Categories/CategoryList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from '../../../styles/CategoryList.module.css';

const CategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                };
                const res = await axios.get('http://localhost:5000/api/categories', config);
                setCategories(res.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch categories. Please try again.');
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const deleteCategory = async id => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            };
            await axios.delete(`http://localhost:5000/api/categories/${id}`, config);
            setCategories(categories.filter(category => category._id !== id));
        } catch (err) {
            setError('Failed to delete category. Please try again.');
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    return (
        <div className={styles.categoryList}>
            <h2>Categories</h2>
            <Link to="/categories/create">Create New Category</Link>
            <ul>
                {categories.map(category => (
                    <li key={category._id}>
                        {category.name} - Type: {category.type}
                        <Link to={`/categories/${category._id}`}>Edit</Link>
                        <button onClick={() => deleteCategory(category._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CategoryList;
