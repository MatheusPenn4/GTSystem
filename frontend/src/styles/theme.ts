import { createTheme, ThemeOptions } from '@mui/material/styles';

const baseTheme: ThemeOptions = {
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      letterSpacing: '-1px',
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      letterSpacing: '-0.75px',
      lineHeight: 1.2,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      letterSpacing: '-0.5px',
      lineHeight: 1.2,
    },
    h4: {
      fontSize: '2.125rem',
      fontWeight: 700,
      letterSpacing: '-0.5px',
      lineHeight: 1.2,
      '@media (max-width:600px)': {
        fontSize: '1.75rem',
      },
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      letterSpacing: '-0.25px',
      lineHeight: 1.2,
    },
    h6: {
      fontSize: '1.1rem',
      fontWeight: 600,
      letterSpacing: '-0.25px',
      lineHeight: 1.2,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      letterSpacing: '-0.25px',
      lineHeight: 1.5,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      letterSpacing: '-0.25px',
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      letterSpacing: '-0.25px',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      letterSpacing: '-0.25px',
      lineHeight: 1.5,
    },
    button: {
      fontSize: '0.875rem',
      fontWeight: 600,
      letterSpacing: '-0.25px',
      lineHeight: 1.5,
      textTransform: 'none',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      letterSpacing: '-0.25px',
      lineHeight: 1.5,
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 600,
      letterSpacing: '0.5px',
      lineHeight: 1.5,
      textTransform: 'uppercase',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: ({ theme: _theme }) => ({
          borderRadius: 8,
          padding: '8px 16px',
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          },
        }),
        contained: ({ theme }) => ({
          background: 'linear-gradient(90deg, #3b4cca 60%, #1a237e 100%)',
          '&:hover': {
            background: 'linear-gradient(90deg, #1a237e 60%, #3b4cca 100%)',
          },
        }),
        outlined: ({ theme }) => ({
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        }),
      },
    },
    MuiCard: {
      styleOverrides: {
        root: ({ theme: _theme }) => ({
          borderRadius: 16,
          transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow:
              _theme.palette.mode === 'dark'
                ? '0 8px 24px rgba(0,0,0,0.4)'
                : '0 8px 24px rgba(0,0,0,0.1)',
          },
        }),
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundImage: 'none',
        }),
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: ({ theme }) => ({
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(26,35,126,0.5)',
            },
          },
        }),
      },
    },
    MuiChip: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 8,
          fontWeight: 500,
        }),
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 8,
          fontWeight: 500,
        }),
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: ({ theme }) => ({
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        }),
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: ({ theme }) => ({
          borderRadius: 8,
          padding: '8px 12px',
          fontSize: '0.875rem',
          fontWeight: 500,
        }),
      },
    },
  },
};

export const lightTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'light',
    primary: {
      main: '#1a237e',
      light: '#3b4cca',
      dark: '#0a0a0f',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
      contrastText: '#ffffff',
    },
    error: {
      main: '#d32f2f',
      light: '#ef5350',
      dark: '#c62828',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#ed6c02',
      light: '#ff9800',
      dark: '#e65100',
      contrastText: '#ffffff',
    },
    info: {
      main: '#0288d1',
      light: '#03a9f4',
      dark: '#01579b',
      contrastText: '#ffffff',
    },
    success: {
      main: '#2e7d32',
      light: '#4caf50',
      dark: '#1b5e20',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f4f8fb',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a2b4e',
      secondary: '#637381',
      disabled: '#a2abb8',
    },
    divider: 'rgba(26,35,126,0.08)',
  },
});

export const darkTheme = createTheme({
  ...baseTheme,
  palette: {
    mode: 'dark',
    primary: {
      main: '#3b4cca',
      light: '#5e6cff',
      dark: '#1a237e',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#42a5f5',
      light: '#80d0ff',
      dark: '#1976d2',
      contrastText: '#ffffff',
    },
    error: {
      main: '#ef5350',
      light: '#ff867c',
      dark: '#c62828',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#ff9800',
      light: '#ffc046',
      dark: '#c77700',
      contrastText: '#000000',
    },
    info: {
      main: '#03a9f4',
      light: '#67daff',
      dark: '#007ac1',
      contrastText: '#000000',
    },
    success: {
      main: '#4caf50',
      light: '#80e27e',
      dark: '#087f23',
      contrastText: '#000000',
    },
    background: {
      default: '#0a0a0f',
      paper: '#121e2f',
    },
    text: {
      primary: '#f4f8fb',
      secondary: '#b0bac9',
      disabled: '#637381',
    },
    divider: 'rgba(255,255,255,0.08)',
  },
  components: {
    ...baseTheme.components,
    MuiCard: {
      styleOverrides: {
        root: ({ theme: _theme }) => ({
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          background: 'rgba(18,30,47,0.95)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.08)',
        }),
      },
    },
  },
});
