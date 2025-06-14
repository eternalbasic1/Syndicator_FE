/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import {
  Box,
  TextField,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRegisterMutation } from '../../store/api/authApi';

const validationSchema = Yup.object({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters')
    .required('Username is required'),
  email: Yup.string()
    .email('Enter a valid email')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  phone_number: Yup.string()
    .matches(/^\d+$/, 'Phone number must contain only digits')
    .min(10, 'Phone number must be at least 10 digits'),
});

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const [register, { isLoading, error, isSuccess }] = useRegisterMutation();

  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      phone_number: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await register(values).unwrap();
      } catch (err) {
        console.error('Registration failed:', err);
      }
    },
  });

  if (isSuccess) {
    return (
      <Box sx={{ textAlign: 'center' }}>
        <Alert severity="success" sx={{ mb: 2 }}>
          Registration successful! Please login with your credentials.
        </Alert>
        <Button onClick={onSwitchToLogin} variant="contained">
          Go to Login
        </Button>
      </Box>
    );
  }

  return (
    <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {(error as any)?.data?.detail || 'Registration failed. Please try again.'}
        </Alert>
      )}
      
      <TextField
        margin="normal"
        required
        fullWidth
        id="username"
        label="Username"
        name="username"
        autoComplete="username"
        value={formik.values.username}
        onChange={formik.handleChange}
        error={formik.touched.username && Boolean(formik.errors.username)}
        helperText={formik.touched.username && formik.errors.username}
      />
      
      <TextField
        margin="normal"
        required
        fullWidth
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        value={formik.values.email}
        onChange={formik.handleChange}
        error={formik.touched.email && Boolean(formik.errors.email)}
        helperText={formik.touched.email && formik.errors.email}
      />
      
      <TextField
        margin="normal"
        fullWidth
        id="phone_number"
        label="Phone Number"
        name="phone_number"
        autoComplete="tel"
        value={formik.values.phone_number}
        onChange={formik.handleChange}
        error={formik.touched.phone_number && Boolean(formik.errors.phone_number)}
        helperText={formik.touched.phone_number && formik.errors.phone_number}
      />
      
      <TextField
        margin="normal"
        required
        fullWidth
        name="password"
        label="Password"
        type="password"
        id="password"
        autoComplete="new-password"
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
        {isLoading ? <CircularProgress size={24} /> : 'Sign Up'}
      </Button>
    </Box>
  );
};

export default RegisterForm;