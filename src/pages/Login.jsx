import React from 'react';
import { Box, Container, Paper, Typography, TextField, Button, Link as MuiLink, Divider } from '@mui/material';
import { Link } from 'react-router-dom';

const LoginPage = () => {
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

          <Box component="form">
            <TextField
              fullWidth
              label="Email Address"
              margin="normal"
              required
              variant="outlined"
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              required
              variant="outlined"
              sx={{ mb: 3 }}
            />

            <Button
              fullWidth
              variant="contained"
              size="large"
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
