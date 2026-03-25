import React, { useState, useMemo, createContext } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import AppRoutes from './super-admin/routes/AppRoutes';

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

function App() {
  const [mode, setMode] = useState('light');
  const logoRed = '#E53935';
  const logoRedDark = '#B71C1C';
  const logoRedSoft = '#FFEBEE';
  const actionGreen = '#10C469';
  const actionGreenDark = '#0aa85a';

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    []
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#E53935', // Vibrant Logo Red from theme page
            light: '#FF6B6B',
            dark: '#B71C1C',
          },
          background: {
            default: mode === 'light' ? '#f5f5f5' : '#121212',
            paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
          },
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
          button: { textTransform: "none", fontWeight: 800 },
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              '.super-admin-shell .MuiButton-root': {
                borderRadius: 12,
                fontWeight: 800,
                textTransform: 'none',
                transition: 'all 0.2s ease',
              },
              '.super-admin-shell .MuiButton-contained': {
                backgroundColor: `${logoRed} !important`,
                color: '#ffffff !important',
                boxShadow: '0 10px 20px rgba(229, 57, 53, 0.22) !important',
              },
              '.super-admin-shell .MuiButton-contained:hover': {
                backgroundColor: `${logoRedDark} !important`,
                boxShadow: '0 12px 24px rgba(183, 28, 28, 0.26) !important',
              },
              '.super-admin-shell .MuiButton-outlined': {
                borderColor: `${logoRed} !important`,
                color: `${logoRed} !important`,
              },
              '.super-admin-shell .MuiButton-outlined:hover': {
                borderColor: `${logoRedDark} !important`,
                backgroundColor: `${logoRedSoft} !important`,
              },
              '.super-admin-shell .MuiButton-text': {
                color: `${logoRed} !important`,
              },
              '.super-admin-shell .MuiButton-text:hover': {
                backgroundColor: `${logoRedSoft} !important`,
              },
              '.super-admin-shell .action-edit, .store-shell .action-edit': {
                backgroundColor: `${actionGreen} !important`,
                color: '#ffffff !important',
                borderRadius: '12px !important',
                boxShadow: '0 10px 20px rgba(16, 196, 105, 0.2) !important',
              },
              '.super-admin-shell .action-edit:hover, .store-shell .action-edit:hover': {
                backgroundColor: `${actionGreenDark} !important`,
              },
              '.super-admin-shell .action-delete, .store-shell .action-delete': {
                backgroundColor: '#FF4D49 !important',
                color: '#ffffff !important',
                borderRadius: '12px !important',
                boxShadow: '0 10px 20px rgba(255, 77, 73, 0.18) !important',
              },
              '.super-admin-shell .action-delete:hover, .store-shell .action-delete:hover': {
                backgroundColor: '#df3733 !important',
              },
              '.super-admin-shell .MuiIconButton-root:has([data-testid="EditIcon"]), .super-admin-shell .MuiIconButton-root:has([data-testid="EditOutlinedIcon"]), .store-shell .MuiIconButton-root:has([data-testid="EditIcon"]), .store-shell .MuiIconButton-root:has([data-testid="EditOutlinedIcon"])': {
                backgroundColor: `${actionGreen} !important`,
                color: '#ffffff !important',
                borderRadius: '12px !important',
                boxShadow: '0 10px 20px rgba(16, 196, 105, 0.2) !important',
              },
              '.super-admin-shell .MuiIconButton-root:has([data-testid="EditIcon"]):hover, .super-admin-shell .MuiIconButton-root:has([data-testid="EditOutlinedIcon"]):hover, .store-shell .MuiIconButton-root:has([data-testid="EditIcon"]):hover, .store-shell .MuiIconButton-root:has([data-testid="EditOutlinedIcon"]):hover': {
                backgroundColor: `${actionGreenDark} !important`,
              },
              '.super-admin-shell .MuiIconButton-root:has([data-testid="DeleteIcon"]), .super-admin-shell .MuiIconButton-root:has([data-testid="DeleteOutlineIcon"]), .store-shell .MuiIconButton-root:has([data-testid="DeleteIcon"]), .store-shell .MuiIconButton-root:has([data-testid="DeleteOutlineIcon"])': {
                backgroundColor: '#FF4D49 !important',
                color: '#ffffff !important',
                borderRadius: '12px !important',
                boxShadow: '0 10px 20px rgba(255, 77, 73, 0.18) !important',
              },
              '.super-admin-shell .MuiIconButton-root:has([data-testid="DeleteIcon"]):hover, .super-admin-shell .MuiIconButton-root:has([data-testid="DeleteOutlineIcon"]):hover, .store-shell .MuiIconButton-root:has([data-testid="DeleteIcon"]):hover, .store-shell .MuiIconButton-root:has([data-testid="DeleteOutlineIcon"]):hover': {
                backgroundColor: '#df3733 !important',
              },
            },
          },
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: 12,
                fontWeight: 800,
                textTransform: 'none',
              },
            },
          },
          MuiDrawer: {
            styleOverrides: {
              paper: {
                backgroundColor: '#1c2536', // Dark sidebar as requested
                color: '#ffffff',
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppRoutes />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
