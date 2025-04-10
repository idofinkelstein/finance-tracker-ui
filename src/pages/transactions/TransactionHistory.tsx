// TransactionHistory.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import TransactionApiResponse from "../../models/transaction-api";
import { authService } from "../../services/authService";

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${day}/${month}/${year}`;
};

const TransactionHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<TransactionApiResponse[]>(
    []
  );

  const fetchTransactions = async () => {
    try {
      const token = authService.getCurrentToken();

      const response = await axios.get<TransactionApiResponse[]>(
        authService.getBaseApiUrl() + "/transactions",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTransactions(response.data);
      transactions.forEach((transaction) =>
        console.log(transaction.category?.name)
      );
    } catch (error) {
      console.error("Error fetching transactions", error);
    }
  };
  const handleDelete = async (id: number) => {
    await axios.delete(`/api/transactions/${id}`);
    fetchTransactions(); // Refresh the list
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div>
      <h1>Transaction History</h1>
      <table>
        <thead>
          <tr>
            <th>Amount</th>
            <th>Category</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.amount}</td>
              <td>{transaction.category?.name}</td>
              <td>{transaction.date.toLocaleString()}</td>
              <td>
                <button
                  onClick={() => transaction.id && handleDelete(transaction.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionHistory;
