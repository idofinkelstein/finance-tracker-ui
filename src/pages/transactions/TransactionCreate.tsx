// TransactionCreate.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { authService } from '../../services/authService';
import TransactionApiResponse from '../../models/transaction-api';
import CategoryApiResponse from '../../models/category-api';

const TransactionCreate: React.FC = () => {
    const [transaction, setTransaction] = useState<TransactionApiResponse>({
        amount: 0,
        date: new Date(),
        description: '',
        transactionType: 'INCOME' // Default value
    });

    const [categories, setCategories] = useState<CategoryApiResponse[]>([]); // State to store categories
    const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');

    // Fetch categories from the API
    const fetchCategories = async () => {
        try {
            const response = await axios.get<CategoryApiResponse[]>(authService.getBaseApiUrl() + '/categories');
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
        if (name === 'amount') {
            const num = parseFloat(value);
            const clamped = Number.isNaN(num) ? 0 : Math.max(0, num);
            setTransaction(prev => ({ ...prev, amount: clamped }));
            return;
        }
        setTransaction(prev => ({
            ...prev,
            [name]: name === 'date' ? new Date(value) : value
        }));
    };

    const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (value === '__new__') {
            setShowNewCategoryInput(true);
            setTransaction(prev => ({ ...prev, categoryId: undefined, categoryResponse: undefined }));
            return;
        }
        setShowNewCategoryInput(false);
        const selectedCategoryId = value ? Number(value) : undefined;
        const selectedCategory = selectedCategoryId ? categories.find(c => c.id === selectedCategoryId) : undefined;
        setTransaction(prev => ({
            ...prev,
            categoryId: selectedCategoryId,
            categoryResponse: selectedCategory,
        }));
    };

    const handleAddNewCategory = async () => {
        const name = newCategoryName.trim();
        if (!name) return;
        try {
            const response = await axios.post<CategoryApiResponse>(authService.getBaseApiUrl() + '/categories', { name });
            const created = response.data;
            await fetchCategories();
            setTransaction(prev => ({
                ...prev,
                categoryId: created.id,
                categoryResponse: created,
            }));
            setNewCategoryName('');
            setShowNewCategoryInput(false);
        } catch (error) {
            console.error('Error creating category:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const transactionData = { ...transaction };
        await axios.post(authService.getBaseApiUrl() + '/transactions', transactionData);
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
            <input type="number" name="amount" min={0} step="1" value={transaction.amount} onChange={handleChange} placeholder="Amount" />
            <input type="date" name="date" value={formatDateForInput(transaction.date)} onChange={handleChange} />
            <input type="text" name="description" value={transaction.description} onChange={handleChange} placeholder="Description" />
            <select name="transactionType" value={transaction.transactionType} onChange={handleChange}>
                <option value={'INCOME'}>Income</option>
                <option value={'EXPENSE'}>Expense</option>
            </select>
            <select
                name="category"
                value={showNewCategoryInput ? '__new__' : (transaction.categoryId ?? '')}
                onChange={handleCategoryChange}
            >
                <option value="">Select a category</option>
                {categories.map(category => (
                    <option key={category.id} value={category.id}>
                        {category.name}
                    </option>
                ))}
                <option value="__new__">+ Add new category</option>
            </select>
            {showNewCategoryInput && (
                <div>
                    <input
                        type="text"
                        value={newCategoryName}
                        onChange={e => setNewCategoryName(e.target.value)}
                        placeholder="New category name"
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddNewCategory(); } }}
                    />
                    <button type="button" onClick={handleAddNewCategory}>Add category</button>
                </div>
            )}
            <button type="submit">Add Transaction</button>
        </form>
    );
};

export default TransactionCreate;