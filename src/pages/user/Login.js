// src/pages/user/Login.js
import React, { useState } from 'react';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  //CustomerId, password, loading
  const [customerId, setCustomerId] = useState(''); 
  const [password, setPassword] = useState(''); 
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate(); 

  // function handleLogin
  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      // API LOGIN
      const response = await fetch('https://demoapihistory-hsgagzgtcse4daby.japaneast-01.azurewebsites.net/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ CustomerId: customerId, Password: password }), 
      });

      // Test server status
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Đăng nhập thất bại');
      }

      const data = await response.json();
      console.log(data);

      // save token, role to localStorage
      localStorage.setItem('token', data.jwt); 
      localStorage.setItem('userRole', data.role); 

      // navigate
      navigate('/user/manage-checkBooks');
    } catch (error) {
      console.error(error.message);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} style={{ padding: '2rem', marginTop: '2rem', display: loading ? 'none' : 'block' }}>
        <Typography component="h1" variant="h5" align="center" gutterBottom>
          Login
        </Typography>
        <Box component="form" onSubmit={handleLogin} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="customerId" 
            label="Customer ID"
            name="customerId" 
            autoComplete="customerId" 
            autoFocus
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            style={{ marginTop: '1rem' }}
            disabled={loading}
          >
            Login
          </Button>
        </Box>
      </Paper>
      {loading && (
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
          <CircularProgress size={60} />
        </Box>
      )}
    </Container>
  );
};

export default Login;
