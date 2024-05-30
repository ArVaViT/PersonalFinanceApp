// src/components/Dashboard/Transactions/TransactionDetails.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useHistory } from 'react-router-dom';
import styles from '../../../styles/TransactionDetails.module.css';

const TransactionDetails = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        amount: '',
        date: '',
        description: '',
        category: '',
        account: ''
    });
    const [categories, setCategories] = useState([]);
    const [accounts, setAccounts] = useState([]);
    const [error, setError] = useState('');
    const history = useHistory();

    useEffect(() => {
        const fetchTransaction = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                };
                const res = await axios.get(`http://localhost:5000/api/transactions/${id}`, config);
                setFormData(res.data);
            } catch (err) {
                setError('Failed to fetch transaction. Please try again.');
            }
        };

        const fetchCategoriesAndAccounts = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                };
                const categoriesRes = await axios.get('http://localhost:5000/api/categories', config);
                const accountsRes = await axios.get('http://localhost:5000/api/accounts', config);
                setCategories(categoriesRes.data);
                setAccounts(accountsRes.data);
            } catch (err) {
                setError('Failed to fetch categories and accounts. Please try again.');
            }
        };

        fetchTransaction();
        fetchCategoriesAndAccounts();
    }, [id]);

    const { amount, date, description, category, account } = formData;

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
            await axios.put(`http://localhost:5000/api/transactions/${id}`, formData, config);
            history.push('/transactions'); // Перенаправление на страницу списка транзакций после обновления
        } catch (err) {
            setError('Failed to update transaction. Please try again.');
        }
    };

    return (
        <div className={styles.transactionDetails}>
            <h2>Update Transaction</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={onSubmit}>
                <div>
                    <label htmlFor="amount">Amount:</label>
                    <input type="number" name="amount" value={amount} onChange={onChange} required />
                </div>
                <div>
                    <label htmlFor="date">Date:</label>
                    <input type="date" name="date" value={date} onChange={onChange} required />
                </div>
                <div>
                    <label htmlFor="description">Description:</label>
                    <input type="text" name="description" value={description} onChange={onChange} />
                </div>
                <div>
                    <label htmlFor="category">Category:</label>
                    <select name="category" value={category} onChange={onChange} required>
                        <option value="">Select Category</option>
                        {categories.map(cat => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label htmlFor="account">Account:</label>
                    <select name="account" value={account} onChange={onChange} required>
                        <option value="">Select Account</option>
                        {accounts.map(acc => (
                            <option key={acc._id} value={acc._id}>{acc.name}</option>
                        ))}
                    </select>
                </div>
                <button type="submit">Update Transaction</button>
            </form>
        </div>
    );
};

export default TransactionDetails;
