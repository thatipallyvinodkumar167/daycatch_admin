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
    fontFamily: '"DM Sans", "Inter", "Plus Jakarta Sans", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 900, color: '#1b2559' },
    h2: { fontWeight: 900, color: '#1b2559' },
    h3: { fontWeight: 900, color: '#1b2559' },
    h4: { fontWeight: 800, color: '#1b2559' },
    h5: { fontWeight: 800, color: '#1b2559' },
    h6: { fontWeight: 800, color: '#1b2559' },
    body1: { fontWeight: 600, color: '#1b2559' },
    body2: { fontWeight: 600, color: '#a3aed0' },
    button: {
      textTransform: 'none',
      fontWeight: 800,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: 'none',
          textTransform: 'none',
          fontWeight: 800,
        },
        contained: {
          backgroundColor: '#E53935',
          color: '#ffffff',
          boxShadow: '0 10px 20px rgba(229, 57, 53, 0.22)',
          '&:hover': {
            backgroundColor: '#B71C1C',
            boxShadow: '0 12px 24px rgba(183, 28, 28, 0.26)',
          },
        },
        outlined: {
          borderColor: '#E53935',
          color: '#E53935',
          '&:hover': {
            borderColor: '#B71C1C',
            backgroundColor: '#FFEBEE',
          },
        },
        text: {
          color: '#E53935',
          '&:hover': {
            backgroundColor: '#FFEBEE',
          },
        }
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontWeight: 700,
          color: '#1b2559',
          borderBottom: '1px solid #e0e5f2',
          padding: '16px',
        },
        head: {
          color: '#a3aed0',
          textTransform: 'uppercase',
          fontSize: '12px',
          fontWeight: 900,
          letterSpacing: '0.05em',
          backgroundColor: '#f4f7fe',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0px 18px 40px rgba(112, 144, 176, 0.12)',
        },
      },
    },
  },
});

export default theme;
