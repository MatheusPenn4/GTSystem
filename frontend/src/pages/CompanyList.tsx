import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  useTheme,
  Fade,
  Zoom,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

interface Company {
  id: number;
  name: string;
  cnpj: string;
  address: string;
  phone: string;
  email: string;
}

const CompanyList: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get<Company[]>('/company/companies/');
      setCompanies(response.data);
    } catch (error) {
      console.error('Erro ao carregar empresas:', error);
      setError('Não foi possível carregar a lista de empresas. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir esta empresa?')) {
      return;
    }

    try {
      await api.delete(`/company/companies/${id}/`);
      setCompanies(companies.filter((company) => company.id !== id));
    } catch (error) {
      console.error('Erro ao excluir empresa:', error);
      setError('Não foi possível excluir a empresa. Tente novamente mais tarde.');
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress
          size={60}
          thickness={4}
          sx={{
            color: theme.palette.primary.main,
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            '@keyframes pulse': {
              '0%, 100%': {
                opacity: 1,
              },
              '50%': {
                opacity: 0.5,
              },
            },
          }}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: { xs: 2, sm: 3 } }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
            <BusinessIcon sx={{ fontSize: 24, color: '#fff' }} />
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
            Empresas
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/companies/new')}
          sx={{
            height: 48,
            borderRadius: 2,
            background:
              theme.palette.mode === 'dark'
                ? 'linear-gradient(90deg, #1a237e 60%, #1976d2 100%)'
                : 'linear-gradient(90deg, #3b4cca 60%, #1a237e 100%)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            '&:hover': {
              background:
                theme.palette.mode === 'dark'
                  ? 'linear-gradient(90deg, #1976d2 60%, #1a237e 100%)'
                  : 'linear-gradient(90deg, #1a237e 60%, #3b4cca 100%)',
              boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
            },
          }}
        >
          Nova Empresa
        </Button>
      </Box>

      {error && (
        <Fade in={true}>
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: 2,
              background:
                theme.palette.mode === 'dark'
                  ? 'rgba(211, 47, 47, 0.1)'
                  : 'rgba(211, 47, 47, 0.05)',
              border: '1px solid rgba(211, 47, 47, 0.2)',
            }}
          >
            {error}
          </Alert>
        </Fade>
      )}

      <Zoom in={true}>
        <Card
          sx={{
            background:
              theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, rgba(18,32,47,0.95) 60%, rgba(26,35,126,0.85) 100%)'
                : 'linear-gradient(135deg, rgba(255,255,255,0.95) 60%, rgba(26,35,126,0.08) 100%)',
            backdropFilter: 'blur(8px)',
            border:
              theme.palette.mode === 'dark'
                ? '1px solid rgba(36,99,235,0.12)'
                : '1px solid rgba(26,35,126,0.08)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
            borderRadius: 4,
          }}
        >
          <CardContent sx={{ p: 0 }}>
            <TableContainer>
              <Table role="table" aria-label="Tabela de empresas cadastradas">
                <TableHead>
                  <TableRow role="row">
                    <TableCell role="columnheader" sx={{ fontWeight: 600 }}>
                      Nome
                    </TableCell>
                    <TableCell role="columnheader" sx={{ fontWeight: 600 }}>
                      CNPJ
                    </TableCell>
                    <TableCell role="columnheader" sx={{ fontWeight: 600 }}>
                      Endereço
                    </TableCell>
                    <TableCell role="columnheader" sx={{ fontWeight: 600 }}>
                      Telefone
                    </TableCell>
                    <TableCell role="columnheader" sx={{ fontWeight: 600 }}>
                      Email
                    </TableCell>
                    <TableCell role="columnheader" align="right" sx={{ fontWeight: 600 }}>
                      Ações
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {companies.map((company) => (
                    <TableRow
                      key={company.id}
                      role="row"
                      tabIndex={0}
                      sx={{
                        '&:hover, &:focus': {
                          background:
                            theme.palette.mode === 'dark'
                              ? 'rgba(36,99,235,0.18)'
                              : 'rgba(26,35,126,0.12)',
                          outline: '2px solid',
                          outlineColor: theme.palette.primary.main,
                        },
                      }}
                      aria-label={`Empresa ${company.name}`}
                    >
                      <TableCell role="cell">{company.name}</TableCell>
                      <TableCell role="cell">{company.cnpj}</TableCell>
                      <TableCell role="cell">{company.address}</TableCell>
                      <TableCell role="cell">{company.phone}</TableCell>
                      <TableCell role="cell">{company.email}</TableCell>
                      <TableCell role="cell" align="right">
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                          <Tooltip title="Editar">
                            <IconButton
                              onClick={() => navigate(`/companies/${company.id}/edit`)}
                              size="small"
                              sx={{
                                color: theme.palette.primary.main,
                                '&:hover': {
                                  background:
                                    theme.palette.mode === 'dark'
                                      ? 'rgba(36,99,235,0.12)'
                                      : 'rgba(26,35,126,0.08)',
                                },
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Excluir">
                            <IconButton
                              onClick={() => handleDelete(company.id)}
                              size="small"
                              sx={{
                                color: theme.palette.error.main,
                                '&:hover': {
                                  background:
                                    theme.palette.mode === 'dark'
                                      ? 'rgba(211, 47, 47, 0.12)'
                                      : 'rgba(211, 47, 47, 0.08)',
                                },
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Zoom>
    </Box>
  );
};

export default CompanyList;
