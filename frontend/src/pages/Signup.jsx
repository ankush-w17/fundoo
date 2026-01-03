import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Container, Paper } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../services/auth.service';

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
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
      await signup(formData);
      navigate('/login');
    } catch (error) {
      console.error('Signup failed:', error);
      alert('Signup failed!');
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
            Create your Fundoo Account
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                margin="normal"
                required
                fullWidth
                id="firstName"
                label="First name"
                name="firstName"
                autoComplete="given-name"
                autoFocus
                value={formData.firstName}
                onChange={handleChange}
                size="small"
                />
                <TextField
                margin="normal"
                required
                fullWidth
                id="lastName"
                label="Last name"
                name="lastName"
                autoComplete="family-name"
                value={formData.lastName}
                onChange={handleChange}
                size="small"
                />
            </Box>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              size="small"
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
              value={formData.password}
              onChange={handleChange}
              size="small"
            />
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3, mb: 2}}>
                <Link to="/login" variant="body2" style={{textDecoration: 'none', color: '#1a73e8', fontSize: '0.875rem', fontWeight: 500}}>
                    Sign in instead
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

export default Signup;
