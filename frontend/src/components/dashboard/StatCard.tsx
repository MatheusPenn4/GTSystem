import React from 'react';
import { Card, CardContent, Typography, Box, useTheme } from '@mui/material';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBgColor?: string;
  fullHeight?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  iconBgColor,
  fullHeight = false,
}) => {
  const theme = useTheme();

  return (
    <Card
      sx={{
        height: fullHeight ? '100%' : 'auto',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'visible',
        transition: 'all 0.3s ease',
        borderRadius: 2,
        padding: '4px',
        background:
          theme.palette.mode === 'dark'
            ? 'linear-gradient(145deg, rgba(18,32,47,0.9), rgba(26,35,126,0.1))'
            : 'linear-gradient(145deg, #ffffff, #f5f7ff)',
        boxShadow:
          theme.palette.mode === 'dark'
            ? '0 8px 24px rgba(0,0,0,0.3)'
            : '0 4px 16px rgba(0,0,0,0.06)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow:
            theme.palette.mode === 'dark'
              ? '0 12px 28px rgba(0,0,0,0.4)'
              : '0 8px 24px rgba(0,0,0,0.09)',
        },
      }}
    >
      <CardContent
        sx={{
          pt: 4,
          px: 2.5,
          pb: 3,
          position: 'relative',
          zIndex: 1,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: -18,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 42,
            height: 42,
            borderRadius: '12px',
            backgroundColor: iconBgColor || theme.palette.primary.main,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#fff',
            boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
            transition: 'all 0.3s ease',
            '& svg': {
              fontSize: '1.5rem',
            },
            '.MuiCard-root:hover &': {
              transform: 'translateX(-50%) translateY(-2px)',
              boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.2)',
            },
            zIndex: 3,
          }}
        >
          {icon}
        </Box>

        <Typography
          variant="body2"
          color="textSecondary"
          align="center"
          sx={{
            fontWeight: 500,
            fontSize: '0.9rem',
            mb: 1.5,
            mt: 0.5,
            opacity: 0.85,
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="h3"
          component="div"
          align="center"
          sx={{
            fontWeight: 700,
            fontSize: { xs: '2rem', sm: '2.3rem' },
            letterSpacing: '-0.02em',
            background:
              theme.palette.mode === 'dark'
                ? 'linear-gradient(45deg, #90caf9, #3f51b5)'
                : 'linear-gradient(45deg, #1a237e, #3949ab)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            WebkitTextFillColor: 'transparent',
            mt: 'auto',
            mb: 0,
          }}
        >
          {value}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default StatCard;
