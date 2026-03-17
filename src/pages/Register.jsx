import React from 'react';
import { Box, Container, Paper, Typography, TextField, Button, Link as MuiLink, Divider, Checkbox, FormControlLabel } from '@mui/material';
import { Link } from 'react-router-dom';

const RegisterPage = () => {
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

          <Box component="form">
            <TextField
              fullWidth
              label="Full Name"
              margin="normal"
              required
              variant="outlined"
              sx={{ mb: 2 }}
            />

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
              sx={{ mb: 2 }}
            />

            <FormControlLabel
              control={
                <Checkbox
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
              variant="contained"
              size="large"
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
