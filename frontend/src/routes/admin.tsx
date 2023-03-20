import { redirect } from 'react-router-dom'
import { Container, Paper, Typography, Button } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import { useSnackBar } from '../contexts/snackbar'
import adminService from '../services/admin.service'
import { AxiosError } from 'axios'

export async function loader() {
  try {
    await adminService.checkIsAdmin()
    return { isAdmin: true }
  } catch {
    return redirect('/')
  }
}
export default function Admin() {
  const { showSnackBar } = useSnackBar()

  const handleLoadFixtures = async () => {
    try {
      await adminService.loadFixtures()
      showSnackBar('Fixtures loaded', 'success')
    } catch (error) {
      let msg
      if (error instanceof AxiosError && typeof error.response.data.detail == 'string')
        msg = error.response.data.detail
      else if (error instanceof Error) msg = error.message
      else msg = String(error)
      showSnackBar(msg, 'error')
    }
  }

  return (
    <Container component='main' maxWidth='sm' sx={{ mb: 4 }}>
      <Paper variant='outlined' sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
        <Typography component='h1' variant='h4' align='center'>
          Admin Control Panel
        </Typography>

        <Button
          variant='contained'
          endIcon={<SendIcon />}
          sx={{ mt: 2 }}
          onClick={handleLoadFixtures}
        >
          Load Fixtures
        </Button>
      </Paper>
    </Container>
  )
}
