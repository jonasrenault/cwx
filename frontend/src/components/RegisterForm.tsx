import { useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { Avatar, Button, TextField, Link, Grid, Box, Typography, Collapse } from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { useForm } from 'react-hook-form'
import authService from '../services/auth.service'
import { useSnackBar } from '../contexts/snackbar'
import { GoogleIcon } from './LoginForm'

const SHOW_EMAIL_REGISTER_FORM: string = import.meta.env.VITE_PWD_SIGNUP_ENABLED

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<User>()
  const navigate = useNavigate()
  const { showSnackBar } = useSnackBar()
  const [expanded, setExpanded] = useState(false)

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  const onSubmit = async (data) => {
    try {
      await authService.register(data)
      showSnackBar('Inscription réussie.', 'success')
      navigate('/login')
    } catch (error) {
      const msg =
        error.response && typeof error.response.data.detail == 'string'
          ? error.response.data.detail
          : error.message
      showSnackBar(msg, 'error')
    }
  }

  const handleGoogleLogin = async () => {
    window.location.href = authService.getGoogleLoginUrl()
  }

  return (
    <div>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component='h1' variant='h5'>
          Inscription
        </Typography>
        <Box>
          <Typography variant='subtitle1' gutterBottom sx={{ mt: 1, color: 'text.secondary' }}>
            Pas besoin de t&apos;inscrire, connecte toi directement avec ton compte Google et nous
            importerons ton profil.
          </Typography>
        </Box>
        <Button
          variant='outlined'
          startIcon={<GoogleIcon />}
          sx={{ width: 1.0, mt: 2 }}
          onClick={handleGoogleLogin}
        >
          Connexion avec Google
        </Button>
        {/* <Button
          variant='outlined'
          startIcon={<FacebookIcon />}
          sx={{ width: 1.0, mt: 2 }}
          onClick={handleGoogleLogin}
        >
          Connexion avec Facebook
        </Button> */}

        {SHOW_EMAIL_REGISTER_FORM && SHOW_EMAIL_REGISTER_FORM.toLowerCase() === 'true' && (
          <Button variant='outlined' sx={{ width: 1.0, mt: 2 }} onClick={handleExpandClick}>
            Inscription avec adresse mail
          </Button>
        )}

        <Collapse in={expanded} timeout='auto'>
          <Box component='form' onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete='given-name'
                  fullWidth
                  id='firstName'
                  label='Prénom'
                  autoFocus
                  {...register('first_name')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label='Nom'
                  autoComplete='family-name'
                  {...register('last_name')}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id='email'
                  label='Adresse mail'
                  autoComplete='email'
                  error={!!errors.email}
                  helperText={errors.email && 'Une adresse mail est nécessaire.'}
                  {...register('email', { required: true })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name='password'
                  label='Mot de passe'
                  type='password'
                  id='password'
                  autoComplete='new-password'
                  error={!!errors.password}
                  helperText={errors.password && 'Un mot de passe est nécessaire.'}
                  {...register('password', { required: true })}
                />
              </Grid>
            </Grid>
            <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
              Inscription
            </Button>
            <Grid container justifyContent='flex-end'>
              <Grid item>
                <Link component={RouterLink} to='/login' variant='body2'>
                  Déjà un compte ? Connecte-toi
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Collapse>
      </Box>
    </div>
  )
}
