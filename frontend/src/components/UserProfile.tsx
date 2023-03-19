import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  FormControlLabel,
  Grid,
  TextField,
} from '@mui/material'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useAuth, User } from '../contexts/auth'
import { useSnackBar } from '../contexts/snackbar'
import userService from '../services/user.service'
import { GoogleIcon } from './LoginForm'

interface UserProfileProps {
  userProfile: User
  onUserUpdated: (user: User) => void
  allowDelete: boolean
}

export default function UserProfile(props: UserProfileProps) {
  const { userProfile, onUserUpdated } = props
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<User>({
    defaultValues: userProfile,
  })
  const navigate = useNavigate()
  const { user: currentUser, setUser, logout } = useAuth()
  const { showSnackBar } = useSnackBar()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    reset(userProfile)
  }, [userProfile])

  const onSubmit = async (data) => {
    let updatedUser
    try {
      if (currentUser.uuid === userProfile.uuid) {
        // Updating user profile.
        updatedUser = await userService.updateProfile(data)
        setUser(updatedUser)
        showSnackBar('Votre profil a été mis à jour.', 'success')
      } else {
        // Updating user different from current user.
        updatedUser = await userService.updateUser(userProfile.uuid, data)
        showSnackBar('Le profil utilisateur a été mis à jour.', 'success')
      }
    } catch (error) {
      const msg =
        error.response && typeof error.response.data.detail == 'string'
          ? error.response.data.detail
          : error.message
      showSnackBar(msg, 'error')
    }

    if (onUserUpdated) {
      onUserUpdated(updatedUser)
    }
  }

  const handleDeleteProfile = async () => {
    setOpen(true)
  }

  const handleCancel = () => setOpen(false)

  const handleConfirm = async () => {
    setOpen(false)
    await userService.deleteSelf()
    showSnackBar('Votre profil a été supprimé.', 'success')
    logout()
    navigate('/')
  }

  return (
    <div>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box
          component='form'
          onSubmit={handleSubmit(onSubmit)}
          sx={{ mt: 3 }}
          key={userProfile.uuid}
          noValidate
          data-testid='user-profile-form'
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete='given-name'
                name='first_name'
                fullWidth
                id='firstName'
                label='Prénom'
                {...register('first_name')}
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id='last_name'
                label='Nom'
                name='lastName'
                autoComplete='family-name'
                {...register('last_name')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id='email'
                label='Adresse mail'
                name='email'
                autoComplete='email'
                required
                disabled={
                  userProfile.provider !== null &&
                  userProfile.provider !== undefined &&
                  userProfile.provider !== ''
                }
                error={!!errors.email}
                helperText={errors.email && 'Une adresse mail est nécessaire.'}
                {...register('email', { required: true })}
              />
            </Grid>

            {userProfile.provider && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name='provider'
                  label='Connecté avec'
                  id='provider'
                  disabled={true}
                  variant='standard'
                  InputProps={{
                    startAdornment: <GoogleIcon sx={{ mr: 1 }} />,
                  }}
                  {...register('provider')}
                />
              </Grid>
            )}

            {!userProfile.provider && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name='password'
                  label='Mot de passe'
                  type='password'
                  id='password'
                  autoComplete='new-password'
                  {...register('password')}
                />
              </Grid>
            )}

            {currentUser?.is_superuser && (
              <>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name='is_active'
                        defaultChecked={userProfile.is_active}
                        color='primary'
                        {...register('is_active')}
                      />
                    }
                    label='Is Active'
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name='is_superuser'
                        defaultChecked={userProfile.is_superuser}
                        color='primary'
                        {...register('is_superuser')}
                      />
                    }
                    label='Is Super User'
                  />
                </Grid>
              </>
            )}
          </Grid>
          <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
            Sauvegarder
          </Button>
          {props.allowDelete && (
            <Button
              fullWidth
              variant='outlined'
              sx={{ mb: 2 }}
              color='error'
              onClick={handleDeleteProfile}
            >
              Supprimer mon profil
            </Button>
          )}
        </Box>
      </Box>
      <Dialog
        open={open}
        onClose={handleCancel}
        aria-describedby='alert-profile-dialog-description'
      >
        <DialogContent>
          <DialogContentText id='alert-profile-dialog-description'>
            Êtes-vous sur de vouloir supprimer votre compte ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel} autoFocus>
            Annuler
          </Button>
          <Button onClick={handleConfirm} variant='contained' color='primary'>
            Confirmer
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
