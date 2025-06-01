// src/pages/Estacionamentos.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  Button,
  useTheme,
  CircularProgress,
  Alert,
  Fade,
  Zoom,
  IconButton,
  Tooltip,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  InputAdornment,
  Grid,
  useMediaQuery,
  Avatar,
  Divider,
} from '@mui/material';
import {
  LocalParking as ParkingIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
  CheckCircle as ActiveIcon,
  Cancel as InactiveIcon,
  Build as MaintenanceIcon,
  Search as SearchIcon,
  Business as BusinessIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useParkingLots, useParking } from '../hooks/useParking';
import { ParkingLot } from '../types/parking';

const ParkingList: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  // Usando os novos hooks
  const [searchParams, setSearchParams] = useState({});
  const { data: parkingData, isLoading: loading, error, refetch } = useParkingLots(searchParams);
  const { deleteParkingMutation, success, clearMessages } = useParking();

  const parkings = parkingData?.results || [];

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [parkingToDelete, setParkingToDelete] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Efeito para buscar dados iniciais
  useEffect(() => {
    refetch();
  }, [refetch]);

  // Atualizar parâmetros de busca quando o termo de busca mudar
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      setSearchParams({ search: searchTerm || undefined });
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm]);

  const handleDeleteClick = (id: number) => {
    setParkingToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (parkingToDelete === null) return;
    try {
      await deleteParkingMutation.mutateAsync(parkingToDelete);
      setDeleteDialogOpen(false);
      refetch(); // Recarregar dados após exclusão
    } catch (error) {
      console.error('Erro ao excluir estacionamento:', error);
    } finally {
      setParkingToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setParkingToDelete(null);
  };

  const handleRefresh = () => {
    refetch();
    clearMessages();
  };

  const getStatusChip = (status?: string) => {
    if (!status || status === 'active') {
      return (
        <Chip
          icon={<ActiveIcon fontSize="small" />}
          label="Ativo"
          size="small"
          color="success"
          variant="outlined"
          sx={{ borderRadius: '12px' }}
        />
      );
    } else if (status === 'maintenance') {
      return (
        <Chip
          icon={<MaintenanceIcon fontSize="small" />}
          label="Em Manutenção"
          size="small"
          color="warning"
          variant="outlined"
          sx={{ borderRadius: '12px' }}
        />
      );
    } else {
      return (
        <Chip
          icon={<InactiveIcon fontSize="small" />}
          label="Inativo"
          size="small"
          color="error"
          variant="outlined"
          sx={{ borderRadius: '12px' }}
        />
      );
    }
  };

  const filteredParkings = parkings.filter(
    (parking) =>
      parking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (parking.address && parking.address.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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
              '0%, 100%': { opacity: 1 },
              '50%': { opacity: 0.5 },
            },
          }}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, p: { xs: 2, sm: 3 } }}>
      {/* Success message */}
      {success && (
        <Fade in>
          <Alert
            severity="success"
            sx={{
              mb: 3,
              borderRadius: 2,
              background:
                theme.palette.mode === 'dark' ? 'rgba(76,175,80,0.1)' : 'rgba(76,175,80,0.05)',
              border: '1px solid rgba(76,175,80,0.2)',
            }}
            onClose={clearMessages}
          >
            {success}
          </Alert>
        </Fade>
      )}

      {/* Cabeçalho */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          mb: 4,
          gap: 2,
        }}
      >
        {/* Ícone e Título */}
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
            <ParkingIcon sx={{ fontSize: 24, color: '#fff' }} />
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
            Estacionamentos
          </Typography>
        </Box>

        {/* Busca e Ações */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            width: { xs: '100%', sm: 'auto' },
          }}
        >
          <TextField
            placeholder="Buscar estacionamentos..."
            size="small"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              minWidth: { sm: '250px' },
              '& .MuiOutlinedInput-root': {
                borderRadius: '20px',
                backgroundColor:
                  theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleRefresh}
              disabled={loading}
              sx={{
                borderRadius: '20px',
                whiteSpace: 'nowrap',
                minWidth: isMobile ? '100%' : 'auto',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                },
                '&:active': { transform: 'translateY(0)' },
              }}
            >
              {loading ? 'Carregando...' : 'Atualizar'}
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => navigate('/estacionamentos/new')}
              sx={{
                borderRadius: '20px',
                background:
                  theme.palette.mode === 'dark'
                    ? 'linear-gradient(90deg, #1a237e 60%, #1976d2 100%)'
                    : 'linear-gradient(90deg, #3b4cca 60%, #1a237e 100%)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background:
                    theme.palette.mode === 'dark'
                      ? 'linear-gradient(90deg, #1976d2 60%, #1a237e 100%)'
                      : 'linear-gradient(90deg, #1a237e 60%, #3b4cca 100%)',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
                  transform: 'translateY(-2px)',
                },
                '&:active': { transform: 'translateY(0)', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
                whiteSpace: 'nowrap',
                minWidth: isMobile ? '100%' : 'auto',
              }}
            >
              Novo Estacionamento
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Erro geral */}
      {error && (
        <Fade in>
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: 2,
              background:
                theme.palette.mode === 'dark' ? 'rgba(211,47,47,0.1)' : 'rgba(211,47,47,0.05)',
              border: '1px solid rgba(211,47,47,0.2)',
            }}
          >
            {error}
          </Alert>
        </Fade>
      )}

      {/* Sem dados */}
      {parkings.length === 0 && !loading ? (
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
            boxShadow: '0 8px 32px 0 rgba(31,38,135,0.1)',
          }}
        >
          <ParkingIcon
            sx={{ fontSize: 80, color: theme.palette.primary.main, opacity: 0.6, mb: 2 }}
          />
          <Typography variant="h5" gutterBottom>
            Nenhum estacionamento cadastrado
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Clique no botão &quot;Novo Estacionamento&quot; para adicionar um estacionamento ao
            sistema.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/estacionamentos/new')}
            sx={{ mt: 2, borderRadius: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          >
            Novo Estacionamento
          </Button>
        </Card>
      ) : (
        <>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2 }}>
            {filteredParkings.length === 0
              ? 'Nenhum estacionamento encontrado'
              : `Exibindo ${filteredParkings.length} de ${parkings.length} estacionamentos`}
          </Typography>

          <Grid container spacing={3}>
            {filteredParkings.map((parking: ParkingLot, index: number) => (
              <Grid item xs={12} md={6} key={parking.id}>
                <Zoom in style={{ transitionDelay: `${index * 100}ms` }}>
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: 2,
                      overflow: 'hidden',
                      background:
                        theme.palette.mode === 'dark'
                          ? 'linear-gradient(135deg, rgba(18,32,47,0.95) 0%, rgba(26,35,126,0.85) 100%)'
                          : 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(240,240,250,0.9) 100%)',
                      backdropFilter: 'blur(10px)',
                      border:
                        theme.palette.mode === 'dark'
                          ? '1px solid rgba(255,255,255,0.1)'
                          : '1px solid rgba(200,200,230,0.3)',
                      boxShadow: '0 8px 32px 0 rgba(31,38,135,0.1)',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 40px 0 rgba(31,38,135,0.15)',
                      },
                    }}
                  >
                    {/* Cabeçalho do cartão */}
                    <Box
                      sx={{
                        p: 2,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        borderBottom:
                          theme.palette.mode === 'dark'
                            ? '1px solid rgba(255,255,255,0.1)'
                            : '1px solid rgba(0,0,0,0.05)',
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 40, height: 40 }}>
                          <ParkingIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
                            {parking.name}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            {getStatusChip(parking.isActive ? 'active' : 'inactive')}
                          </Box>
                        </Box>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Editar">
                          <IconButton
                            size="small"
                            onClick={() => navigate(`/estacionamentos/edit/${parking.id}`)}
                            sx={{
                              bgcolor:
                                theme.palette.mode === 'dark'
                                  ? 'rgba(255,255,255,0.1)'
                                  : 'rgba(0,0,0,0.05)',
                              '&:hover': {
                                bgcolor:
                                  theme.palette.mode === 'dark'
                                    ? 'rgba(255,255,255,0.2)'
                                    : 'rgba(0,0,0,0.1)',
                                transform: 'rotate(15deg) scale(1.1)',
                              },
                              transition: 'all 0.2s ease',
                              zIndex: 10,
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Excluir">
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteClick(parking.id)}
                            sx={{
                              bgcolor:
                                theme.palette.mode === 'dark'
                                  ? 'rgba(255,255,255,0.1)'
                                  : 'rgba(0,0,0,0.05)',
                              '&:hover': {
                                bgcolor:
                                  theme.palette.mode === 'dark'
                                    ? 'rgba(255,0,0,0.2)'
                                    : 'rgba(255,0,0,0.1)',
                                transform: 'rotate(-15deg) scale(1.1)',
                                color: theme.palette.error.main,
                              },
                              transition: 'all 0.2s ease',
                              zIndex: 10,
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>

                    <Box sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LocationIcon fontSize="small" color="action" />
                          <Typography variant="body2">
                            {parking.address || 'Endereço não informado'}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <BusinessIcon fontSize="small" color="action" />
                          <Typography variant="body2">
                            <strong>Descrição:</strong> {parking.description || 'Não informado'}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PhoneIcon fontSize="small" color="action" />
                          <Typography variant="body2">
                            <strong>Capacidade:</strong> {parking.capacity || 0} vagas
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <EmailIcon fontSize="small" color="action" />
                          <Typography variant="body2">
                            <strong>Criado em:</strong>{' '}
                            {parking.createdAt
                              ? new Date(parking.createdAt).toLocaleDateString('pt-BR')
                              : 'Não informado'}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    <Divider />

                    <Box
                      sx={{
                        p: 2,
                        bgcolor:
                          theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.02)',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          width: '100%',
                          justifyContent: 'center',
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Vagas Disponíveis:
                          </Typography>
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: 'bold', color: theme.palette.success.main }}
                          >
                            {parking.availableSpots || 0}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                            de {parking.capacity || 0}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Card>
                </Zoom>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* Dialog excluir */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 8px 32px 0 rgba(31,38,135,0.25)',
            background:
              theme.palette.mode === 'dark'
                ? 'linear-gradient(135deg, rgba(18,32,47,0.95) 0%, rgba(26,35,126,0.85) 100%)'
                : 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(240,240,250,0.9) 100%)',
            backdropFilter: 'blur(10px)',
            border:
              theme.palette.mode === 'dark'
                ? '1px solid rgba(255,255,255,0.1)'
                : '1px solid rgba(200,200,230,0.3)',
          },
        }}
        TransitionComponent={Zoom}
      >
        <Box
          sx={{
            position: 'relative',
            p: 1,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: theme.palette.error.main,
              borderTopLeftRadius: '12px',
              borderTopRightRadius: '12px',
            },
          }}
        >
          <DialogTitle
            id="alert-dialog-title"
            sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 2 }}
          >
            <Avatar sx={{ bgcolor: theme.palette.error.main }}>
              <DeleteIcon />
            </Avatar>
            <Typography variant="h6">Confirmar exclusão</Typography>
          </DialogTitle>
          <DialogContent sx={{ p: 3, pt: 2 }}>
            <DialogContentText id="alert-dialog-description">
              Tem certeza que deseja excluir este estacionamento? Esta ação não pode ser desfeita.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ p: 2.5, pt: 1.5 }}>
            <Button
              onClick={handleDeleteCancel}
              variant="outlined"
              disabled={deleteParkingMutation.isPending}
              sx={{ borderRadius: '20px', px: 3 }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              variant="contained"
              color="error"
              startIcon={
                deleteParkingMutation.isPending ? <CircularProgress size={20} /> : <DeleteIcon />
              }
              disabled={deleteParkingMutation.isPending}
              sx={{ borderRadius: '20px', px: 3 }}
            >
              {deleteParkingMutation.isPending ? 'Excluindo...' : 'Excluir'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Box>
  );
};

// Componente principal sem provider - agora usa React Query diretamente
const Estacionamentos: React.FC = () => (
  <Box sx={{ flexGrow: 1 }}>
    <ParkingList />
  </Box>
);

export default Estacionamentos;
