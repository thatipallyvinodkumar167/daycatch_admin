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
  IconButton,
  Stack
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material';
import axios from 'axios';
import logo from '../assets/logo.png';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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

      // ✅ Block non-Super Admin users from accessing this panel
      const role = user["role Name"] || user.roleName || user.role || '';
      if (role !== 'Super Admin') {
        alert('Access Denied! This panel is for Super Admins only.');
        setLoading(false);
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user_role", role);
      localStorage.setItem("user_email", user.Email);
      localStorage.setItem("user_name", user.Name);

      navigate("/");
      window.location.reload();
    } catch (error) {
      console.error('Login error:', error);
      const errData = error.response?.data;
      const errMsg =
        typeof errData === 'string'
          ? errData
          : errData?.message || errData?.error || errData?.msg
          ? String(errData?.message || errData?.error || errData?.msg)
          : 'Login failed. Please check your credentials and try again.';
      alert(errMsg);
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
      {/* Abstract Background Shapes */}
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
          {/* Brand Logo & Header */}
          <Box sx={{ mb: 3.5 }}>
            <img src={logo} alt="DayCatch" style={{ height: '52px', marginBottom: '16px' }} />
            <Typography variant="h5" sx={{ fontWeight: 900, color: '#1b2559', mb: 0.5, letterSpacing: '-0.5px' }}>
              Super Admin Login
            </Typography>
            <Typography variant="body2" sx={{ color: '#a3aed0', fontWeight: 500 }}>
              Access the central hub of DayCatch Platform
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              <TextField
                fullWidth
                size="small"
                label="EMAIL ADDRESS"
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
                  "& .MuiOutlinedInput-root": { 
                    borderRadius: '12px', 
                    backgroundColor: '#fff',
                    "& fieldset": { borderColor: '#e0e5f2' }
                  },
                  "& .MuiInputLabel-root": { fontSize: '12px', fontWeight: 700, transform: 'translate(40px, 10px) scale(1)' },
                  "& .MuiInputLabel-shrink": { transform: 'translate(14px, -6px) scale(0.85)' }
                }}
              />

              <TextField
                fullWidth
                size="small"
                label="PASSWORD"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock sx={{ color: '#a3aed0', fontSize: '20px' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                        {showPassword ? <VisibilityOff sx={{ fontSize: '20px' }} /> : <Visibility sx={{ fontSize: '20px' }} />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ 
                  "& .MuiOutlinedInput-root": { 
                    borderRadius: '12px', 
                    backgroundColor: '#fff',
                    "& fieldset": { borderColor: '#e0e5f2' }
                  },
                  "& .MuiInputLabel-root": { fontSize: '12px', fontWeight: 700, transform: 'translate(40px, 10px) scale(1)' },
                  "& .MuiInputLabel-shrink": { transform: 'translate(14px, -6px) scale(0.85)' }
                }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: -1 }}>
                <MuiLink
                  component={Link}
                  to="/forgot-password"
                  sx={{ 
                    fontWeight: 800, 
                    color: '#4318ff', 
                    fontSize: '13px', 
                    textDecoration: 'none',
                    '&:hover': { textDecoration: 'underline' } 
                  }}
                >
                  Forgot Password?
                </MuiLink>
              </Box>

              <Button
                fullWidth
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  py: 1.8,
                  fontWeight: 900,
                  borderRadius: '12px',
                  backgroundColor: '#4318ff',
                  boxShadow: '0 4px 14px rgba(67, 24, 255, 0.3)',
                  textTransform: 'none',
                  fontSize: '16px',
                  '&:hover': {
                    backgroundColor: '#3311cc',
                    boxShadow: '0 6px 20px rgba(67, 24, 255, 0.4)',
                  }
                }}
              >
                {loading ? 'Entering...' : 'Sign In Now'}
              </Button>
            </Stack>
          </Box>

          <Box sx={{ my: 3, display: 'flex', alignItems: 'center' }}>
            <Divider sx={{ flex: 1, borderColor: '#e0e5f2' }} />
            <Typography variant="caption" sx={{ px: 2, color: '#a3aed0', fontWeight: 800, fontSize: '11px' }}>SECURE ACCESS</Typography>
            <Divider sx={{ flex: 1, borderColor: '#e0e5f2' }} />
          </Box>

          <Typography variant="body2" sx={{ color: '#a3aed0', fontWeight: 600 }}>
            Management Account Required?{' '}
            <MuiLink
              component={Link}
              to="/register"
              sx={{ fontWeight: 800, color: '#4318ff', textDecoration: 'none' }}
            >
              Sign Up for Access
            </MuiLink>
          </Typography>

        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
