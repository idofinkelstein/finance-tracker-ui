import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Layout from "./components/Layout";
import "./App.css";
import TransactionCreate from "./pages/transactions/TransactionCreate";
import TransactionDetail from "./pages/transactions/TransactionDetail";
import TransactionHistory from "./pages/transactions/TransactionHistory";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import { AuthProvider } from "./context/AuthContext";
import RequireAuth from "./components/RequireAuth";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes with layout */}
            {/* <RequireAuth> */}

            <Route path="/home" element={
              <RequireAuth>
                <Layout>
                  <HomePage />
                </Layout>
              </RequireAuth>
            } />
            <Route path="/transactions" element={
              <RequireAuth>
                <Layout>
                  <TransactionHistory />
                </Layout>
              </RequireAuth>
            } />
            <Route path="/transactions/create" element={
              <RequireAuth>
                <Layout>
                  <TransactionCreate />
                </Layout>
              </RequireAuth>
            } />
            <Route path="/transactions/:id" element={
              <RequireAuth>
                <Layout>
                  <TransactionDetail />
                </Layout>
              </RequireAuth>
            } />
            <Route path="/dashboard" element={
              <RequireAuth>
                <Layout>
                  <Dashboard />
                </Layout>
              </RequireAuth>
            } />
            <Route path="/" element={<Navigate to="/home" replace />} />
            {/* </RequireAuth> */}
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
