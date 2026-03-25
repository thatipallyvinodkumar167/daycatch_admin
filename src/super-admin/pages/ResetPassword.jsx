import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Stack,
  Alert,
  IconButton,
  Collapse,
  Link as MuiLink
} from '@mui/material';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Visibility, VisibilityOff, Lock, CheckCircle } from '@mui/icons-material';
import api from '../../api/api';
import logo from '../../assets/logo.png';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      setLoading(false);
      return;
    }
    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters.");
      setLoading(false);
      return;
    }

    try {
      await api.patch(`/auth/reset-password/${token}`, { password });
      setSuccess(true);
    } catch (error) {
      console.error('Reset password error:', error);
      const errData = error.response?.data;
      const msg =
        typeof errData === 'string'
          ? errData
          : errData?.message || errData?.error || errData?.msg
          ? String(errData?.message || errData?.error || errData?.msg)
          : 'Failed to reset password. The link may have expired.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #f4f7fe 0%, #e0e7ff 100%)', position: 'relative', overflow: 'hidden'
    }}>
      <Container maxWidth={false} sx={{ display: 'flex', justifyContent: 'center' }}>
        <Paper elevation={0} sx={{ p: { xs: 4, md: 5 }, borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.06)', width: '100%', maxWidth: '430px', textAlign: 'center' }}>
          
          <Box sx={{ mb: 3.5 }}>
            <img src={logo} alt="DayCatch" style={{ height: '52px', marginBottom: '16px' }} />
            <Typography variant="h5" sx={{ fontWeight: 900, color: '#1b2559', mb: 0.5, letterSpacing: '-0.5px' }}>
              Create New Password
            </Typography>
            <Typography variant="body2" sx={{ color: '#a3aed0', fontWeight: 500 }}>
              {success ? "Your password has been successfully reset." : "Please enter your new security key below."}
            </Typography>
          </Box>

          <Collapse in={success}>
            <Box sx={{ mb: 3, p: 3, borderRadius: '16px', bgcolor: 'rgba(0, 210, 106, 0.06)', border: '1px solid rgba(0, 210, 106, 0.2)' }}>
              <CheckCircle sx={{ color: '#00d26a', fontSize: 48, mb: 1 }} />
              <Typography fontWeight="800" color="#1b2559" sx={{ mb: 0.5 }}>Success!</Typography>
              <Typography variant="body2" color="#a3aed0" fontWeight="600">You can now login with your new password.</Typography>
            </Box>
            <Button fullWidth variant="contained" onClick={() => navigate('/login')} sx={{ py: 1.8, fontWeight: 900, borderRadius: '12px', backgroundColor: '#4318ff' }}>
              Login Now
            </Button>
          </Collapse>

          <Collapse in={!success}>
            <Stack spacing={2.5} component="form" onSubmit={handleSubmit}>
              <Collapse in={!!errorMsg}>
                <Alert severity="error" sx={{ borderRadius: '12px', textAlign: 'left', fontWeight: 600 }}>{errorMsg}</Alert>
              </Collapse>

              <TextField
                fullWidth size="small" label="NEW PASSWORD" type={showPassword ? 'text' : 'password'} required
                value={password} onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (<InputAdornment position="start"><Lock sx={{ color: '#a3aed0', fontSize: '20px' }} /></InputAdornment>),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                        {showPassword ? <VisibilityOff sx={{ fontSize: '20px' }} /> : <Visibility sx={{ fontSize: '20px' }} />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' }, '& .MuiInputLabel-root': { fontSize: '12px', fontWeight: 700, transform: 'translate(40px, 10px)' } }}
              />

              <TextField
                fullWidth size="small" label="CONFIRM NEW PASSWORD" type={showPassword ? 'text' : 'password'} required
                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                InputProps={{
                  startAdornment: (<InputAdornment position="start"><Lock sx={{ color: '#a3aed0', fontSize: '20px' }} /></InputAdornment>),
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' }, '& .MuiInputLabel-root': { fontSize: '12px', fontWeight: 700, transform: 'translate(40px, 10px)' } }}
              />

              <Button fullWidth type="submit" variant="contained" disabled={loading} sx={{ py: 1.8, fontWeight: 900, borderRadius: '12px', backgroundColor: '#4318ff', '&:hover': { backgroundColor: '#3311cc' } }}>
                {loading ? 'Resetting...' : 'Reset Password'}
              </Button>
            </Stack>

            <Typography variant="body2" sx={{ color: '#a3aed0', fontWeight: 600, mt: 3 }}>
              Remembered your password?{' '}
              <MuiLink component={Link} to="/login" sx={{ fontWeight: 800, color: '#4318ff', textDecoration: 'none' }}>
                Back to Login
              </MuiLink>
            </Typography>
          </Collapse>
        </Paper>
      </Container>
    </Box>
  );
};

export default ResetPassword;


