import React from 'react';
import { Box, Container, Paper, Typography, TextField, Button, Link as MuiLink, Divider } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5001/api/v1/auth/login', {
        email,
        password
      });

      const { token, data } = response.data;
      const { user } = data;

      localStorage.setItem("token", token);
      localStorage.setItem("user_role", user["role Name"]);
      localStorage.setItem("user_email", user.Email);
      localStorage.setItem("user_name", user.Name);

      alert(`Welcome back, ${user.Name}!`);
      navigate("/");
      window.location.reload(); 
    } catch (error) {
      console.error('Login error:', error);
      alert(error.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ py: 12, bgcolor: '#F8F9FA', minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <Container maxWidth="xs">
        <Paper sx={{ p: 4, borderRadius: 4, boxShadow: '0 8px 32px rgba(0,0,0,0.05)' }}>
          
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1, textAlign: 'center', color: "#E53935" }}>
            Welcome Back
          </Typography>

          <Typography variant="body2" sx={{ mb: 4, textAlign: 'center', color: "#E53935" }}>
            Enter your details to access your account
          </Typography>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email Address"
              margin="normal"
              required
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              required
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
                  bgcolor: "#C62828"
                }
              }}
            >
              Login
            </Button>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <MuiLink
              component={Link}
              to="/forgot-password"
              variant="body2"
              sx={{ fontWeight: 600, color: "#E53935" }}
            >
              Forgot Password?
            </MuiLink>
          </Box>

          <Divider sx={{ my: 3 }}>OR</Divider>

          <Typography variant="body2" sx={{ textAlign: 'center' }}>
            Don't have an account?{' '}
            <MuiLink
              component={Link}
              to="/register"
              sx={{ fontWeight: 700, color: "#E53935" }}
            >
              Sign Up
            </MuiLink>
          </Typography>

        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
