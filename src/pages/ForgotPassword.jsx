import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Link as MuiLink,
  Divider,
  InputAdornment,
  Stack,
  Alert,
  Collapse
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { Email, CheckCircle } from '@mui/icons-material';
import api from '../api/api';
import logo from '../assets/logo.png';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      await api.post('/auth/forgot-password', { email });
      setSuccess(true);
    } catch (error) {
      console.error('Forgot password error:', error);
      const errData = error.response?.data;
      const msg =
        typeof errData === 'string'
          ? errData
          : errData?.message || errData?.error || errData?.msg
          ? String(errData?.message || errData?.error || errData?.msg)
          : 'Failed to send reset email. Please try again.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f4f7fe 0%, #e0e7ff 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Blobs */}
      <Box sx={{ position: 'absolute', top: '-10%', right: '-5%', width: '400px', height: '400px', borderRadius: '50%', background: 'rgba(67, 24, 255, 0.05)', filter: 'blur(60px)' }} />
      <Box sx={{ position: 'absolute', bottom: '-10%', left: '-5%', width: '300px', height: '300px', borderRadius: '50%', background: 'rgba(67, 24, 255, 0.1)', filter: 'blur(50px)' }} />

      <Container maxWidth={false} sx={{ display: 'flex', justifyContent: 'center' }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 5 },
            borderRadius: '24px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.06)',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(15px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            textAlign: 'center',
            width: '100%',
            maxWidth: '430px'
          }}
        >
          {/* Header */}
          <Box sx={{ mb: 3.5 }}>
            <img src={logo} alt="DayCatch" style={{ height: '52px', marginBottom: '16px' }} />
            <Typography variant="h5" sx={{ fontWeight: 900, color: '#1b2559', mb: 0.5, letterSpacing: '-0.5px' }}>
              Forgot Password
            </Typography>
            <Typography variant="body2" sx={{ color: '#a3aed0', fontWeight: 500 }}>
              {success
                ? 'Check your inbox for the reset instructions.'
                : "Enter your registered email and we'll send you a password reset link."}
            </Typography>
          </Box>

          {/* Success State */}
          <Collapse in={success}>
            <Box sx={{ mb: 3, p: 3, borderRadius: '16px', bgcolor: 'rgba(0, 210, 106, 0.06)', border: '1px solid rgba(0, 210, 106, 0.2)' }}>
              <CheckCircle sx={{ color: '#00d26a', fontSize: 48, mb: 1 }} />
              <Typography fontWeight="800" color="#1b2559" sx={{ mb: 0.5 }}>
                Reset Email Sent!
              </Typography>
              <Typography variant="body2" color="#a3aed0" fontWeight="600">
                We've sent a password reset link to <strong>{email}</strong>. Please check your inbox and spam folder.
              </Typography>
            </Box>
            <Button
              fullWidth
              variant="contained"
              onClick={() => navigate('/login')}
              sx={{
                py: 1.8, fontWeight: 900, borderRadius: '12px',
                backgroundColor: '#4318ff', textTransform: 'none', fontSize: '15px',
                boxShadow: '0 4px 14px rgba(67, 24, 255, 0.3)',
                '&:hover': { backgroundColor: '#3311cc' }
              }}
            >
              Back to Login
            </Button>
          </Collapse>

          {/* Form */}
          <Collapse in={!success}>
            <Stack spacing={2.5} component="form" onSubmit={handleSubmit}>

              <Collapse in={!!errorMsg}>
                <Alert severity="error" sx={{ borderRadius: '12px', textAlign: 'left', fontWeight: 600 }}>
                  {errorMsg}
                </Alert>
              </Collapse>

              <TextField
                fullWidth
                size="small"
                label="REGISTERED EMAIL"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: '#a3aed0', fontSize: '20px' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                    backgroundColor: '#fff',
                    '& fieldset': { borderColor: '#e0e5f2' }
                  },
                  '& .MuiInputLabel-root': { fontSize: '12px', fontWeight: 700, transform: 'translate(40px, 10px) scale(1)' },
                  '& .MuiInputLabel-shrink': { transform: 'translate(14px, -6px) scale(0.85)' }
                }}
              />

              <Button
                fullWidth
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  py: 1.8, fontWeight: 900, borderRadius: '12px',
                  backgroundColor: '#4318ff', textTransform: 'none', fontSize: '15px',
                  boxShadow: '0 4px 14px rgba(67, 24, 255, 0.3)',
                  '&:hover': { backgroundColor: '#3311cc' }
                }}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </Stack>
          </Collapse>

          <Box sx={{ my: 3, display: 'flex', alignItems: 'center' }}>
            <Divider sx={{ flex: 1, borderColor: '#e0e5f2' }} />
            <Typography variant="caption" sx={{ px: 2, color: '#a3aed0', fontWeight: 800, fontSize: '11px' }}>
              SECURE ACCESS
            </Typography>
            <Divider sx={{ flex: 1, borderColor: '#e0e5f2' }} />
          </Box>

          <Typography variant="body2" sx={{ color: '#a3aed0', fontWeight: 600 }}>
            Remembered your password?{' '}
            <MuiLink
              component={Link}
              to="/login"
              sx={{ fontWeight: 800, color: '#4318ff', textDecoration: 'none' }}
            >
              Back to Login
            </MuiLink>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default ForgotPassword;
