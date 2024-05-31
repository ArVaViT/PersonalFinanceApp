// src/components/Dashboard/Accounts/AccountList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from '../../../styles/AccountList.module.css';

const AccountList = () => {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                };
                const res = await axios.post('https://personal-finance-app-rngp.vercel.app/api/accounts/create', formData, config);
                setAccounts(res.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch accounts. Please try again.');
                setLoading(false);
            }
        };

        fetchAccounts();
    }, []);

    const deleteAccount = async id => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            };
            await await axios.post('https://personal-finance-app-rngp.vercel.app/api/accounts/create', formData, config);
            setAccounts(accounts.filter(account => account._id !== id));
        } catch (err) {
            setError('Failed to delete account. Please try again.');
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    return (
        <div className={styles.accountList}>
            <h2>My Accounts</h2>
            <Link to="/accounts/create">Create New Account</Link>
            <ul>
                {accounts.map(account => (
                    <li key={account._id}>
                        {account.name} - Type: {account.type}, Balance: {account.balance}
                        <Link to={`/accounts/${account._id}`}>Edit</Link>
                        <button onClick={() => deleteAccount(account._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AccountList;
