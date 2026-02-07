import { Box, Button, Container, TextField, Typography, Paper, Link, Alert } from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { authService } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

const validationSchema = Yup.object({
  uernameOrEmail: Yup.string()
    .required('שדה חובה'),
  password: Yup.string()
    .min(6, 'סיסמה חייבת להכיל לפחות 6 תווים')
    .required('שדה חובה'),
});

interface LocationState {
  from?: string;
}

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const locationState = location.state as LocationState;
  const from = locationState?.from || '/home';

  const formik = useFormik({
    initialValues: {
      uernameOrEmail: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        setError('');
        const response = await authService.login(values);
        const token = response?.token ?? response?.accessToken;
        if (typeof token !== 'string' || !token.trim()) {
          setError('שגיאה בהתחברות: לא התקבל אסימון מהשרת');
          return;
        }
        login(token);
        navigate(from, { replace: true });
      } catch (err: any) {
        setError(err.response?.data?.message || 'שגיאה בהתחברות');
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center">
            התחברות
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="uernameOrEmail"
              label="שם משתמש או אימייל"
              name="uernameOrEmail"
              autoComplete="username"
              autoFocus
              value={formik.values.uernameOrEmail}
              onChange={formik.handleChange}
              error={formik.touched.uernameOrEmail && Boolean(formik.errors.uernameOrEmail)}
              helperText={formik.touched.uernameOrEmail && formik.errors.uernameOrEmail}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="סיסמה"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
            >
              {isLoading ? 'מתחבר...' : 'התחבר'}
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Link component={RouterLink} to="/register" variant="body2">
                {"אין לך חשבון? הירשם כאן"}
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login; 