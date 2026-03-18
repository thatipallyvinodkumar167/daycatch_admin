import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FF3B30', // Electric Crimson
      light: '#FF6B6B',
      dark: '#C41C16',
    },
    secondary: {
      main: '#0F172A', // Deep Slate / Midnight
    },
    background: {
      default: '#F8FAFC', // Soft Ghost White
      paper: '#FFFFFF',
    },
    text: {
      primary: '#0F172A', // High contrast slate
      secondary: '#64748B', // Slate grey
    },
    error: {
      main: '#EF4444',
    },
    action: {
      hover: 'rgba(255, 59, 48, 0.05)',
    }
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(255, 42, 35, 0.2)',
          },
        },
      },
    },
  },
});

export default theme;
