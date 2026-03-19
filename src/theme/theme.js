import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#E53935', // Vibrant Logo Red
      light: '#FF6B6B',
      dark: '#B71C1C',
    },
    secondary: {
      main: '#333333', // Deep Grey for balance
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#212121', // Near black for readability
      secondary: '#757575',
    },
    error: {
      main: '#D32F2F',
    },
    action: {
      hover: '#FFEBEE',
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
