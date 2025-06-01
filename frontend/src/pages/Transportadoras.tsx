import React from 'react';
import { Box, Typography, Card, CardContent, Button, useTheme } from '@mui/material';
import { LocalShipping as TransportIcon, Add as AddIcon } from '@mui/icons-material';

const Transportadoras: React.FC = () => {
  const theme = useTheme();

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          mb: 4,
        }}
      >
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background:
              theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, #1a237e 60%, #1976d2 100%)'
                : 'linear-gradient(135deg, #3b4cca 60%, #1a237e 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
        >
          <TransportIcon sx={{ fontSize: 24, color: '#fff' }} />
        </Box>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            color: theme.palette.text.primary,
            letterSpacing: '-1px',
            textShadow:
              theme.palette.mode === 'dark'
                ? '0 2px 8px rgba(0,0,0,0.3)'
                : '0 2px 8px rgba(26,35,126,0.1)',
          }}
        >
          Transportadoras
        </Typography>
      </Box>

      <Card
        sx={{
          p: 4,
          textAlign: 'center',
          borderRadius: 4,
          background:
            theme.palette.mode === 'dark'
              ? 'linear-gradient(135deg, rgba(18,32,47,0.95) 0%, rgba(26,35,126,0.85) 100%)'
              : 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(232,234,246,0.8) 100%)',
          backdropFilter: 'blur(8px)',
          border:
            theme.palette.mode === 'dark'
              ? '1px solid rgba(255,255,255,0.08)'
              : '1px solid rgba(26,35,126,0.08)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
        }}
      >
        <TransportIcon
          sx={{
            fontSize: 80,
            color: theme.palette.primary.main,
            opacity: 0.6,
            mb: 2,
          }}
        />
        <Typography variant="h5" gutterBottom>
          Módulo de Transportadoras em Desenvolvimento
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Este módulo está sendo desenvolvido e estará disponível em breve.
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} disabled sx={{ mt: 2 }}>
          Nova Transportadora
        </Button>
      </Card>
    </Box>
  );
};

export default Transportadoras;
