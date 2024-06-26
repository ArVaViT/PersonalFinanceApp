// src/components/Dashboard/Transactions/TransactionForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import styles from '../../../styles/TransactionForm.module.css';

const TransactionForm = () => {
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
        const fetchCategoriesAndAccounts = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                };
                const categoriesRes = await axios.post('https://my-personal-finance-app-1e2eb0485e32.herokuapp.com/api/transactions/create', formData, config);
                const accountsRes = await axios.post('https://my-personal-finance-app-1e2eb0485e32.herokuapp.com/api/transactions/create', formData, config);
                setCategories(categoriesRes.data);
                setAccounts(accountsRes.data);
            } catch (err) {
                setError('Failed to fetch categories and accounts. Please try again.');
            }
        };

        fetchCategoriesAndAccounts();
    }, []);

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
            await axios.post('https://my-personal-finance-app-1e2eb0485e32.herokuapp.com/api/transactions/create', formData, config);
            history.push('/transactions'); // Перенаправление на страницу списка транзакций после создания
        } catch (err) {
            setError('Failed to create transaction. Please try again.');
        }
    };

    return (
        <div className={styles.transactionForm}>
            <h2>Create Transaction</h2>
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
                <button type="submit">Create Transaction</button>
            </form>
        </div>
    );
};

export default TransactionForm;
