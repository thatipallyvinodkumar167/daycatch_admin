import React, { useState } from 'react';
import toast from 'react-hot-toast';
import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControlLabel,
  InputAdornment,
  Link as MuiLink,
  Paper,
  Stack,
  TextField,
  Typography,
  IconButton
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { Email, Lock, Person, Visibility, VisibilityOff } from '@mui/icons-material';
import api from '../../api/api';
import logo from '../../assets/logo.png';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    roleName: 'Super Admin'
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/auth/register', formData);
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      // Redundant error alerts removed; handled by global api interceptor.
      if (error.response?.status === 403) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f4f7fe 0%, #e0e7ff 100%)',
        position: 'relative',
        overflow: 'hidden',
        py: 4
      }}
    >
      <Box sx={{ position: 'absolute', top: '5%', left: '2%', width: '250px', height: '250px', borderRadius: '50%', background: 'rgba(36, 209, 100, 0.05)', filter: 'blur(50px)' }} />
      <Box sx={{ position: 'absolute', bottom: '5%', right: '2%', width: '350px', height: '350px', borderRadius: '50%', background: 'rgba(67, 24, 255, 0.08)', filter: 'blur(60px)' }} />

      <Container maxWidth={false} sx={{ display: 'flex', justifyContent: 'center' }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: '24px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.06)',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(15px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            textAlign: 'center',
            width: '100%',
            maxWidth: '420px'
          }}
        >
          {/* Brand Logo & Header */}
          <Box sx={{ mb: 3.5 }}>
            <img src={logo} alt="DayCatch" style={{ height: '52px', marginBottom: '16px' }} />
            <Typography variant="h5" sx={{ fontWeight: 900, color: '#1b2559', mb: 0.5, letterSpacing: '-0.5px' }}>
              Super Admin Registration
            </Typography>
            <Typography variant="body2" sx={{ color: '#a3aed0', fontWeight: 500 }}>
              First-time setup of the DayCatch Platform
            </Typography>
          </Box>
          <Box component="form" onSubmit={handleSubmit}>
                <Stack spacing={1.5}>
                  <TextField
                    fullWidth
                    size="small"
                    label="FULL NAME"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person sx={{ color: '#a3aed0', fontSize: '18px' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": { borderRadius: '12px', backgroundColor: '#fff', "& fieldset": { borderColor: '#e0e5f2' } },
                      "& .MuiInputLabel-root": { fontSize: '12px', fontWeight: 700, transform: 'translate(40px, 10px) scale(1)' },
                      "& .MuiInputLabel-shrink": { transform: 'translate(14px, -6px) scale(0.85)' }
                    }}
                  />

                  <TextField
                    fullWidth
                    size="small"
                    label="WORK EMAIL"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email sx={{ color: '#a3aed0', fontSize: '18px' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": { borderRadius: '12px', backgroundColor: '#fff', "& fieldset": { borderColor: '#e0e5f2' } },
                      "& .MuiInputLabel-root": { fontSize: '12px', fontWeight: 700, transform: 'translate(40px, 10px) scale(1)' },
                      "& .MuiInputLabel-shrink": { transform: 'translate(14px, -6px) scale(0.85)' }
                    }}
                  />

                  <TextField
                    fullWidth
                    size="small"
                    label="SECURE PASSWORD"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: '#a3aed0', fontSize: '18px' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                            {showPassword ? <VisibilityOff sx={{ fontSize: '18px' }} /> : <Visibility sx={{ fontSize: '18px' }} />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": { borderRadius: '12px', backgroundColor: '#fff', "& fieldset": { borderColor: '#e0e5f2' } },
                      "& input::-ms-reveal, & input::-ms-clear": {
                        display: "none"
                      },
                      "& input::-webkit-contacts-auto-fill-button, & input::-webkit-credentials-auto-fill-button": {
                        visibility: "hidden",
                        display: "none !important",
                        pointerEvents: "none",
                        position: "absolute",
                        right: 0
                      },
                      "& .MuiInputLabel-root": { fontSize: '12px', fontWeight: 700, transform: 'translate(40px, 10px) scale(1)' },
                      "& .MuiInputLabel-shrink": { transform: 'translate(14px, -6px) scale(0.85)' }
                    }}
                  />

                  <FormControlLabel
                    control={
                      <Checkbox
                        required
                        size="small"
                        sx={{
                          py: 0.5,
                          color: "#4318ff",
                          '&.Mui-checked': { color: "#4318ff" },
                        }}
                      />
                    }
                    label={
                      <Typography variant="caption" fontWeight="600" color="#a3aed0" sx={{ lineHeight: 1 }}>
                        I acknowledge that I am creating the main Super Admin account. *
                      </Typography>
                    }
                    sx={{ mb: 0.5, textAlign: 'left', ml: 0 }}
                  />

                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{
                      py: 1.5,
                      fontWeight: 900,
                      borderRadius: '12px',
                      backgroundColor: '#4318ff',
                      boxShadow: '0 4px 14px rgba(67, 24, 255, 0.3)',
                      textTransform: 'none',
                      fontSize: '15px',
                      '&:hover': {
                        backgroundColor: '#3311cc',
                        boxShadow: '0 6px 20px rgba(67, 24, 255, 0.4)',
                      }
                    }}
                  >
                    {loading ? 'Processing...' : 'Register Super Admin'}
                  </Button>
                </Stack>
              </Box>

          <Box sx={{ my: 1.5, display: 'flex', alignItems: 'center' }}>
            <Divider sx={{ flex: 1, borderColor: '#e0e5f2' }} />
            <Typography variant="caption" sx={{ px: 1.5, color: '#a3aed0', fontWeight: 800, fontSize: '10px' }}>SECURE ACCESS</Typography>
            <Divider sx={{ flex: 1, borderColor: '#e0e5f2' }} />
          </Box>

          <Typography variant="body2" sx={{ color: '#a3aed0', fontWeight: 600 }}>
            Already have a Super Admin account?{' '}
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

export default RegisterPage;


