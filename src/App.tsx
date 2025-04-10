import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';
import TransactionCreate from './pages/transactions/TransactionCreate';
import TransactionDetail from './pages/transactions/TransactionDetail';
import TransactionHistory from './pages/transactions/TransactionHistory';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/transactions/" element={<TransactionHistory />} />
        <Route path="/transactions/create" element={<TransactionCreate />} />
        <Route path="/transactions/:id" element={<TransactionDetail />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <div>Dashboard (להחליף עם הקומפוננטה האמיתית)</div>
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
