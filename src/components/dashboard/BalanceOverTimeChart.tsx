import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { CircularProgress, Typography, useTheme } from '@mui/material';
import { authService } from '../../services/authService';
import TransactionApiResponse from '../../models/transaction-api';

export interface BalancePoint {
  date: string;
  balance: number;
  timestamp: number;
}

function parseDate(d: Date | string): Date {
  return typeof d === 'string' ? new Date(d) : d;
}

function computeBalanceOverTime(transactions: TransactionApiResponse[]): BalancePoint[] {
  if (transactions.length === 0) {
    return [{ date: new Date().toLocaleDateString(), balance: 0, timestamp: Date.now() }];
  }

  const sorted = [...transactions].sort(
    (a, b) => parseDate(a.date).getTime() - parseDate(b.date).getTime()
  );

  const points: BalancePoint[] = [];
  let balance = 0;

  const firstDate = parseDate(sorted[0].date);
  points.push({
    date: firstDate.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }),
    balance: 0,
    timestamp: firstDate.getTime(),
  });

  for (const t of sorted) {
    const date = parseDate(t.date);
    if (t.transactionType === 'INCOME') {
      balance += t.amount;
    } else {
      balance -= t.amount;
    }
    points.push({
      date: date.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }),
      balance: Math.round(balance * 100) / 100,
      timestamp: date.getTime(),
    });
  }

  return points;
}

const BalanceOverTimeChart = () => {
  const theme = useTheme();
  const [transactions, setTransactions] = useState<TransactionApiResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      try {
        const response = await axios.get<TransactionApiResponse[]>(
          authService.getBaseApiUrl() + '/transactions'
        );
        if (!cancelled) {
          setTransactions(Array.isArray(response.data) ? response.data : []);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError('Failed to load transactions');
          setTransactions([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchData();
    return () => { cancelled = true; };
  }, []);

  const data = useMemo(() => computeBalanceOverTime(transactions), [transactions]);

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

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${v}`} />
        <Tooltip
          formatter={(value: number) => [value, 'Balance']}
          labelFormatter={(label) => `Date: ${label}`}
        />
        <Area
          type="monotone"
          dataKey="balance"
          stroke={theme.palette.primary.main}
          fill={theme.palette.primary.main}
          fillOpacity={0.3}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default BalanceOverTimeChart;
