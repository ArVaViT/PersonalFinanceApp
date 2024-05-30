// src/components/Dashboard/Transactions/TransactionList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import styles from '../../../styles/TransactionList.module.css';

const TransactionList = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                };
                const res = await axios.get('http://localhost:5000/api/transactions', config);
                setTransactions(res.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch transactions. Please try again.');
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    const deleteTransaction = async id => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            };
            await axios.delete(`http://localhost:5000/api/transactions/${id}`, config);
            setTransactions(transactions.filter(transaction => transaction._id !== id));
        } catch (err) {
            setError('Failed to delete transaction. Please try again.');
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    return (
        <div className={styles.transactionList}>
            <h2>Transactions</h2>
            <Link to="/transactions/create">Create New Transaction</Link>
            <ul>
                {transactions.map(transaction => (
                    <li key={transaction._id}>
                        {transaction.amount} - Date: {transaction.date}, Description: {transaction.description}
                        <Link to={`/transactions/${transaction._id}`}>Edit</Link>
                        <button onClick={() => deleteTransaction(transaction._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TransactionList;
