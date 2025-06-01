import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  CircularProgress,
  Alert,
  useMediaQuery,
  useTheme,
  Divider,
  Snackbar,
  Tooltip,
  IconButton,
  InputAdornment,
  Card,
} from '@mui/material';
import { Info, Save, Business, Person, Refresh } from '@mui/icons-material';
import { useSettingsContext } from '../context/SettingsContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { mask, unMask } from 'remask';

interface UserFormValues {
  name: string;
  email: string;
  phone: string;
}

interface CompanyFormValues {
  name: string;
  cnpj: string;
  address: string;
  phone: string;
  email: string;
}

interface FormikForm {
  setFieldValue: (field: string, value: string) => void;
}

const Settings: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const {
    userProfile,
    companySettings,
    loading,
    error,
    fetchUserProfile,
    updateUserProfile,
    fetchCompanySettings,
    updateCompanySettings,
  } = useSettingsContext();

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const userFormik = useFormik<UserFormValues>({
    initialValues: {
      name: '',
      email: '',
      phone: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Nome é obrigatório'),
      email: Yup.string().email('Email inválido').required('Email é obrigatório'),
      phone: Yup.string().matches(/^\(\d{2}\) \d{5}-\d{4}$/, 'Telefone inválido'),
    }),
    onSubmit: async (values) => {
      try {
        await updateUserProfile(values);
        setSnackbar({
          open: true,
          message: 'Perfil atualizado com sucesso!',
          severity: 'success',
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Erro ao atualizar perfil.',
          severity: 'error',
        });
      }
    },
  });

  const companyFormik = useFormik<CompanyFormValues>({
    initialValues: {
      name: '',
      cnpj: '',
      address: '',
      phone: '',
      email: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Nome da empresa é obrigatório'),
      cnpj: Yup.string()
        .matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, 'CNPJ inválido')
        .required('CNPJ é obrigatório'),
      address: Yup.string().required('Endereço é obrigatório'),
      phone: Yup.string()
        .matches(/^\(\d{2}\) \d{5}-\d{4}$/, 'Telefone inválido')
        .required('Telefone é obrigatório'),
      email: Yup.string().email('Email inválido').required('Email é obrigatório'),
    }),
    onSubmit: async (values) => {
      try {
        await updateCompanySettings(values);
        setSnackbar({
          open: true,
          message: 'Configurações da empresa atualizadas com sucesso!',
          severity: 'success',
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Erro ao atualizar configurações da empresa.',
          severity: 'error',
        });
      }
    },
  });

  useEffect(() => {
    fetchUserProfile();
    fetchCompanySettings();
  }, [fetchUserProfile, fetchCompanySettings]);

  useEffect(() => {
    if (userProfile) {
      userFormik.setValues({
        name: userProfile.name || '',
        email: userProfile.email || '',
        phone: userProfile.phone || '',
      });
    }
  }, [userProfile]);

  useEffect(() => {
    if (companySettings) {
      companyFormik.setValues({
        name: companySettings.name || '',
        cnpj: companySettings.cnpj || '',
        address: companySettings.address || '',
        phone: companySettings.phone || '',
        email: companySettings.email || '',
      });
    }
  }, [companySettings]);

  const handlePhoneChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    formik: FormikForm
  ) => {
    const value = mask(unMask(e.target.value), ['(99) 99999-9999']);
    formik.setFieldValue(e.target.name, value);
  };

  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = mask(unMask(e.target.value), ['99.999.999/9999-99']);
    companyFormik.setFieldValue('cnpj', value);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, p: 3 }}>
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
              Não foi possível carregar as configurações
            </Typography>
            <Typography variant="body2">{error}</Typography>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => {
                fetchUserProfile();
                fetchCompanySettings();
              }}
              sx={{ mt: 1 }}
              startIcon={<Refresh />}
            >
              Tentar novamente
            </Button>
          </Box>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}
      >
        <Business sx={{ color: theme.palette.primary.main }} />
        Configurações
      </Typography>

      <Grid container spacing={3}>
        {/* Perfil do Usuário */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              height: '100%',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Person sx={{ mr: 1, color: theme.palette.primary.main }} />
              <Typography variant="h5" component="h2">
                Perfil do Usuário
              </Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />

            <form onSubmit={userFormik.handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="name"
                    name="name"
                    label="Nome Completo"
                    value={userFormik.values.name}
                    onChange={userFormik.handleChange}
                    onBlur={userFormik.handleBlur}
                    error={userFormik.touched.name && Boolean(userFormik.errors.name)}
                    helperText={userFormik.touched.name && userFormik.errors.name}
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="email"
                    name="email"
                    label="Email"
                    value={userFormik.values.email}
                    onChange={userFormik.handleChange}
                    onBlur={userFormik.handleBlur}
                    error={userFormik.touched.email && Boolean(userFormik.errors.email)}
                    helperText={userFormik.touched.email && userFormik.errors.email}
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="phone"
                    name="phone"
                    label="Telefone"
                    value={userFormik.values.phone}
                    onChange={(e) => handlePhoneChange(e, userFormik)}
                    onBlur={userFormik.handleBlur}
                    error={userFormik.touched.phone && Boolean(userFormik.errors.phone)}
                    helperText={userFormik.touched.phone && userFormik.errors.phone}
                    variant="outlined"
                    placeholder="(00) 00000-0000"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Tooltip title="Formato: (00) 00000-0000">
                            <IconButton size="small" edge="end">
                              <Info fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    startIcon={<Save />}
                    disabled={!userFormik.isValid || !userFormik.dirty}
                    sx={{ mt: 2 }}
                  >
                    Salvar Perfil
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>

        {/* Configurações da Empresa */}
        <Grid item xs={12} md={6}>
          <Paper
            sx={{
              p: 3,
              borderRadius: '16px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              height: '100%',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Business sx={{ mr: 1, color: theme.palette.primary.main }} />
              <Typography variant="h5" component="h2">
                Dados da Empresa
              </Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />

            {!companySettings ? (
              <Card
                sx={{
                  p: 3,
                  borderRadius: '12px',
                  textAlign: 'center',
                  background:
                    theme.palette.mode === 'dark' ? 'rgba(18,32,47,0.8)' : 'rgba(255,255,255,0.9)',
                  boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.1)',
                }}
              >
                <Business
                  sx={{ fontSize: 48, color: theme.palette.primary.main, opacity: 0.6, mb: 2 }}
                />
                <Typography variant="h6" gutterBottom>
                  Sem empresa associada
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  Você não possui uma empresa associada ao seu perfil. Entre em contato com o
                  administrador para associar uma empresa.
                </Typography>
              </Card>
            ) : (
              <form onSubmit={companyFormik.handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="name"
                      name="name"
                      label="Nome da Empresa"
                      value={companyFormik.values.name}
                      onChange={companyFormik.handleChange}
                      onBlur={companyFormik.handleBlur}
                      error={companyFormik.touched.name && Boolean(companyFormik.errors.name)}
                      helperText={companyFormik.touched.name && companyFormik.errors.name}
                      variant="outlined"
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="cnpj"
                      name="cnpj"
                      label="CNPJ"
                      value={companyFormik.values.cnpj}
                      onChange={handleCnpjChange}
                      onBlur={companyFormik.handleBlur}
                      error={companyFormik.touched.cnpj && Boolean(companyFormik.errors.cnpj)}
                      helperText={companyFormik.touched.cnpj && companyFormik.errors.cnpj}
                      variant="outlined"
                      placeholder="00.000.000/0000-00"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Tooltip title="Formato: 00.000.000/0000-00">
                              <IconButton size="small" edge="end">
                                <Info fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </InputAdornment>
                        ),
                      }}
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="address"
                      name="address"
                      label="Endereço"
                      value={companyFormik.values.address}
                      onChange={companyFormik.handleChange}
                      onBlur={companyFormik.handleBlur}
                      error={companyFormik.touched.address && Boolean(companyFormik.errors.address)}
                      helperText={companyFormik.touched.address && companyFormik.errors.address}
                      variant="outlined"
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="phone"
                      name="phone"
                      label="Telefone"
                      value={companyFormik.values.phone}
                      onChange={(e) => handlePhoneChange(e, companyFormik)}
                      onBlur={companyFormik.handleBlur}
                      error={companyFormik.touched.phone && Boolean(companyFormik.errors.phone)}
                      helperText={companyFormik.touched.phone && companyFormik.errors.phone}
                      variant="outlined"
                      placeholder="(00) 00000-0000"
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      id="email"
                      name="email"
                      label="Email Corporativo"
                      value={companyFormik.values.email}
                      onChange={companyFormik.handleChange}
                      onBlur={companyFormik.handleBlur}
                      error={companyFormik.touched.email && Boolean(companyFormik.errors.email)}
                      helperText={companyFormik.touched.email && companyFormik.errors.email}
                      variant="outlined"
                      sx={{ mb: 2 }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      startIcon={<Save />}
                      disabled={!companyFormik.isValid || !companyFormik.dirty}
                      sx={{ mt: 2 }}
                    >
                      Salvar Empresa
                    </Button>
                  </Grid>
                </Grid>
              </form>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
      />
    </Container>
  );
};

export default Settings;
