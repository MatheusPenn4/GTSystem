import React from 'react';
import { Box, useTheme } from '@mui/material';

interface ContentWrapperProps {
  children: React.ReactNode;
}

const ContentWrapper: React.FC<ContentWrapperProps> = ({ children }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: '100%',
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        pt: 1,
        borderRadius: 0,
        animation: 'fadeIn 0.3s ease-in-out',
        '& > .MuiTypography-h4, & > h1': {
          fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem' },
          fontWeight: 700,
          mb: 3,
          color:
            theme.palette.mode === 'dark'
              ? theme.palette.primary.light
              : theme.palette.primary.dark,
        },
        '& > .MuiTypography-h5, & > h2': {
          fontSize: { xs: '1.3rem', sm: '1.5rem', md: '1.7rem' },
          fontWeight: 600,
          mb: 2.5,
          mt: 2,
          color: theme.palette.text.primary,
        },
      }}
    >
      {children}
    </Box>
  );
};

export default ContentWrapper;
