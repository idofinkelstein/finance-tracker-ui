import { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { CircularProgress, Typography } from '@mui/material';
import { authService } from '../../services/authService';

/** Matches API response: ExpensesByCategoryResponse */
export interface ExpensesByCategoryResponse {
  category: { id: number; name: string };
  totalAmount: number;
}

/** Data shape for Recharts Pie: name + value */
interface PieDataItem {
  name: string;
  value: number;
}

/** Default palette for pie slices; theme colors can be used for consistency */
const PIE_COLORS = [
  '#1976d2', '#2e7d32', '#ed6c02', '#9c27b0', '#0288d1',
  '#388e3c', '#d32f2f', '#7b1fa2', '#00796b', '#f57c00',
];

const ExpensesByCategoryChart = () => {
  const [data, setData] = useState<PieDataItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      try {
        // startDate and endDate left empty for now; will be used when filters are added
        const params: { startDate?: string; endDate?: string } = {};
        const response = await axios.get<ExpensesByCategoryResponse[]>(
          authService.getBaseApiUrl() + '/summaries/expenses-by-category',
          { params }
        );
        if (!cancelled) {
          const raw = Array.isArray(response.data) ? response.data : [];
          setData(
            raw.map((item) => ({
              name: item.category?.name ?? 'Uncategorized',
              value: Number(item.totalAmount) || 0,
            }))
          );
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError('Failed to load expenses by category');
          setData([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchData();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <Typography color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <CircularProgress size={20} /> Loading…
      </Typography>
    );
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (data.length === 0) {
    return (
      <Typography color="text.secondary">
        No expense data by category for the selected period.
      </Typography>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius="70%"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => [value.toFixed(2), 'Amount']}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default ExpensesByCategoryChart;
