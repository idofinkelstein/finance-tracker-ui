// TransactionDetail.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { authService } from "../../services/authService";
import TransactionApiResponse from "../../models/transaction-api";

// const formatDate = (date: Date) => {
//     const formatter = new Intl.DateTimeFormat('en-GB', { // use 'en-GB' for dd/MM/yyyy
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric',
//     });
//     return formatter.format(date);
// }

const TransactionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [transaction, setTransaction] = useState<TransactionApiResponse | null>(null);

  const fetchTransaction = async () => {
    const token = authService.getCurrentToken();
    const response = await axios.get<TransactionApiResponse>(
      authService.getBaseApiUrl() + `/transactions/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setTransaction(response.data);
  };

  const handleDelete = async () => {
    if (transaction) {
      await axios.delete(`/api/transactions/${transaction.id}`);
      // Redirect or update UI after deletion
    }
  };

  useEffect(() => {
    fetchTransaction();
  }, [id]);

  return (
    <div>
      {transaction && (
        <div>
          <h1>Transaction Detail</h1>
          <p>Amount: {transaction.amount}</p>
          <p>Category: {transaction.category?.name}</p>
          <p>Date: {transaction.date.toString()}</p>
          <p>Description: {transaction.description}</p>
          <button onClick={handleDelete}>Delete Transaction</button>
        </div>
      )}
    </div>
  );
};

export default TransactionDetail;
