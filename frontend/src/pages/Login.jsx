import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Container, Paper } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/auth.service';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        // Assuming login returns { token: '...' } or similar
      const data = await login(formData);
      localStorage.setItem('token', data.data.token); // Store the actual token string
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed!');
    }
  };

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
         <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 2, width: '100%' }}>
            <Typography component="h1" variant="h5" sx={{ mb: 2, color: '#202124', fontWeight: 500 }}>
                <span style={{color: '#4285F4'}}>F</span>
                <span style={{color: '#EA4335'}}>u</span>
                <span style={{color: '#FBBC05'}}>n</span>
                <span style={{color: '#4285F4'}}>d</span>
                <span style={{color: '#34A853'}}>o</span>
                <span style={{color: '#EA4335'}}>o</span>
            </Typography>
            <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
                Sign in
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
                to continue to Fundoo Notes
            </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email or phone"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              size="small"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Enter your password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              size="small"
              sx={{ mb: 4 }}
            />
             <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3, mb: 2}}>
                <Link to="/signup" variant="body2" style={{textDecoration: 'none', color: '#1a73e8', fontSize: '0.875rem', fontWeight: 500}}>
                    Create account
                </Link>
                <Button
                type="submit"
                variant="contained"
                sx={{ ml: 3, bgcolor: '#1a73e8', textTransform: 'none', fontWeight: 500 }}
                >
                Next
                </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
