// TransactionCreate.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { authService } from '../../services/authService';
import TransactionApiResponse from '../../models/transaction-api';
import CategoryApiResponse from '../../models/category-api';

const formatDate = (date: Date) => {
    const formatter = new Intl.DateTimeFormat('en-GB', { // use 'en-GB' for dd/MM/yyyy
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    return formatter.format(date);
}

const TransactionCreate: React.FC = () => {
    const [transaction, setTransaction] = useState<TransactionApiResponse>({
        amount: 0,
        date: new Date(),
        description: '',
        transactionType: 'INCOME' // Default value
    });

    const [categories, setCategories] = useState<CategoryApiResponse[]>([]); // State to store categories

    // Fetch categories from the API
    const fetchCategories = async () => {
        try {
            const token = authService.getCurrentToken();
            const response = await axios.get<CategoryApiResponse[]>(authService.getBaseApiUrl() + '/categories', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCategories(response.data);
            
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        fetchCategories(); // Fetch categories when the component mounts
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'date') {
            console.log(value);
        } 
        setTransaction(prev => ({
            ...prev,
            [name]: name === 'amount' ? parseFloat(value) : name === 'date' ? new Date(value) : value
        }));
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCategoryId = e.target.value;
        const selectedCategory = categories.find(category => category.id === Number(selectedCategoryId));
        console.log(selectedCategory);
        setTransaction(prev => ({
            ...prev,
            categoryId: Number(selectedCategoryId),
            categoryResponse: selectedCategory,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const token = authService.getCurrentToken();
        const transactionData = {
            ...transaction,
        };
        await axios.post(authService.getBaseApiUrl() + '/transactions', transactionData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        // Redirect or update UI after creation
    };

    const formatDateForInput = (date: Date): string => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="number" name="amount" value={transaction.amount} onChange={handleChange} placeholder="Amount" />
            <input type="date" name="date" value={formatDateForInput(transaction.date)} onChange={handleChange} />
            <input type="text" name="description" value={transaction.description} onChange={handleChange} placeholder="Description" />
            <select name="transactionType" value={transaction.transactionType} onChange={handleChange}>
                <option value={'INCOME'}>Income</option>
                <option value={'EXPENSE'}>Expense</option>
            </select>
            <select name="category" value={transaction.categoryId} onChange={handleCategoryChange}>
                <option value="">Select a category</option>
                {categories.map(category => (
                    <option key={category.id} value={category.id}>
                        {category.name}
                    </option>
                ))}
            </select>
            <button type="submit">Add Transaction</button>
        </form>
    );
};

export default TransactionCreate;