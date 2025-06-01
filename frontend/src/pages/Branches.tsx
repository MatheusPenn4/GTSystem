import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Snackbar,
  useTheme,
} from '@mui/material';
import { Edit, Delete, Add, Business, Refresh } from '@mui/icons-material';
import { useBranchContext } from '../context/BranchContext';
import { Branch } from '../hooks/useBranch';

interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error';
}

const Branches: React.FC = () => {
  const { branches, loading, error, fetchBranches, createBranch, updateBranch, deleteBranch } =
    useBranchContext();
  const [openModal, setOpenModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [form, setForm] = useState({ name: '', address: '' });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'success',
  });
  const theme = useTheme();

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  const handleOpenModal = (branch?: Branch) => {
    setFormError('');
    if (branch) {
      setEditingBranch(branch);
      setForm({ name: branch.name, address: branch.address });
    } else {
      setEditingBranch(null);
      setForm({ name: '', address: '' });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingBranch(null);
    setForm({ name: '', address: '' });
    setFormError('');
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    if (!form.name.trim() || !form.address.trim()) {
      setFormError('Preencha todos os campos.');
      return;
    }
    setSubmitting(true);
    try {
      if (editingBranch) {
        await updateBranch(editingBranch.id, form);
        setSnackbar({ open: true, message: 'Filial atualizada com sucesso!', severity: 'success' });
      } else {
        await createBranch(form);
        setSnackbar({ open: true, message: 'Filial criada com sucesso!', severity: 'success' });
      }
      handleCloseModal();
    } catch {
      setFormError('Erro ao salvar filial.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir esta filial?')) return;
    try {
      await deleteBranch(id);
      setSnackbar({ open: true, message: 'Filial excluída com sucesso!', severity: 'success' });
    } catch {
      setSnackbar({ open: true, message: 'Erro ao excluir filial.', severity: 'error' });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 }, width: '100%', maxWidth: '100%' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 700,
            color: theme.palette.text.primary,
            letterSpacing: '-1px',
          }}
        >
          Filiais
        </Typography>
        <Button
          variant="contained"
          onClick={() => handleOpenModal()}
          startIcon={<Add />}
          sx={{
            borderRadius: 2,
            fontWeight: 600,
          }}
        >
          Nova Filial
        </Button>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress size={60} thickness={4} />
        </Box>
      ) : error ? (
        <Alert
          severity="error"
          sx={{
            mb: 2,
            borderRadius: '12px',
            background:
              theme.palette.mode === 'dark' ? 'rgba(211, 47, 47, 0.1)' : 'rgba(211, 47, 47, 0.05)',
            border: '1px solid rgba(211, 47, 47, 0.2)',
            '& .MuiAlert-icon': {
              color: theme.palette.error.main,
            },
          }}
        >
          <Box>
            <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
              Não foi possível carregar a lista de filiais
            </Typography>
            <Typography variant="body2">{error}</Typography>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => fetchBranches()}
              sx={{ mt: 1 }}
              startIcon={<Refresh />}
            >
              Tentar novamente
            </Button>
          </Box>
        </Alert>
      ) : branches.length === 0 ? (
        <Card
          sx={{
            p: 4,
            borderRadius: '16px',
            textAlign: 'center',
            background:
              theme.palette.mode === 'dark' ? 'rgba(18,32,47,0.8)' : 'rgba(255,255,255,0.9)',
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
            width: '100%',
            maxWidth: '100%',
          }}
        >
          <Business sx={{ fontSize: 60, color: theme.palette.primary.main, opacity: 0.6, mb: 2 }} />
          <Typography variant="h6" gutterBottom>
            Nenhuma filial cadastrada
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Clique no botão &quot;Nova Filial&quot; para adicionar sua primeira filial.
          </Typography>
          <Button
            variant="contained"
            onClick={() => handleOpenModal()}
            startIcon={<Add />}
            sx={{ mt: 1 }}
          >
            Nova Filial
          </Button>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {branches.map((branch) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={branch.id}>
              <Card
                sx={{
                  borderRadius: 2,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  height: '100%',
                  width: '100%',
                }}
              >
                <CardContent>
                  <Box display="flex" alignItems="flex-start" justifyContent="space-between">
                    <Box>
                      <Box display="flex" alignItems="center" mb={1}>
                        <Business sx={{ mr: 1, color: theme.palette.primary.main }} />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {branch.name}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {branch.address}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Criado em: {new Date(branch.created_at).toLocaleDateString()}
                      </Typography>
                    </Box>
                    <Box>
                      <IconButton
                        onClick={() => handleOpenModal(branch)}
                        size="small"
                        sx={{ mr: 1 }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(branch.id)}
                        size="small"
                        color="error"
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>{editingBranch ? 'Editar Filial' : 'Nova Filial'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Nome da Filial"
            type="text"
            fullWidth
            variant="outlined"
            value={form.name}
            onChange={handleFormChange}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            name="address"
            label="Endereço"
            type="text"
            fullWidth
            variant="outlined"
            value={form.address}
            onChange={handleFormChange}
          />
          {formError && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {formError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary" disabled={submitting}>
            {submitting ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
      />
    </Box>
  );
};

export default Branches;
