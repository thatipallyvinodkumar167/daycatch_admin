import React from 'react';
import { Box, Container, Paper, Typography, TextField, Button, Link as MuiLink, Divider, Checkbox, FormControlLabel } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import { MenuItem } from '@mui/material';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    roleName: 'Manager'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5001/api/v1/auth/register', formData);
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response?.status === 403) {
        alert(error.response.data.error || 'Super Admin already registered. Navigating to login.');
        navigate('/login');
      } else {
        alert(error.response?.data?.error || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ py: 12, bgcolor: '#F8F9FA', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <Container maxWidth="xs">
        <Paper sx={{ p: 4, borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.05)' }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, textAlign: 'center',color:"#E53935" }}>
            Create Account
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 4, textAlign: 'center', color:"#E53935" }}>
            Join DayCatch and enjoy fresh seafood
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              margin="normal"
              required
              variant="outlined"
              value={formData.name}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              margin="normal"
              required
              variant="outlined"
              value={formData.email}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              margin="normal"
              required
              variant="outlined"
              value={formData.password}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              select
              label="Select Role"
              name="roleName"
              margin="normal"
              required
              variant="outlined"
              value={formData.roleName}
              onChange={handleChange}
              sx={{ mb: 2 }}
            >
              <MenuItem value="Super Admin">Super Admin</MenuItem>
              <MenuItem value="Manager">Manager</MenuItem>
              <MenuItem value="Staff">Staff</MenuItem>
            </TextField>

            <FormControlLabel
              control={
                <Checkbox
                  required
                  sx={{
                    color: "#B71C1C",
                    '&.Mui-checked': {
                      color: "#B71C1C",
                    },
                  }}
                />
              }
              label={
                <Typography variant="body2">
                  I agree to the Terms and Conditions
                </Typography>
              }
              sx={{ mb: 3 }}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                py: 1.5,
                fontWeight: 700,
                borderRadius: 2,
                mb: 2,
                bgcolor: "#E53935",
                '&:hover': {
                  bgcolor: "#8E0000"
                }
              }}
            >
              Sign Up
            </Button>
          </Box>

          <Divider sx={{ my: 3 }}>OR</Divider>

          <Typography variant="body2" sx={{ textAlign: 'center' }}>
            Already have an account?{' '}
            <MuiLink component={Link} to="/login" sx={{ fontWeight: 700, color: "#E53935" }}>
              Login
            </MuiLink>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default RegisterPage;
