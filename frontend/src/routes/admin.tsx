import { redirect } from 'react-router-dom'
import { Container, Paper, Typography, Button } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import { useSnackBar } from '../contexts/snackbar'
import adminService from '../services/admin.service'

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
      const msg =
        error.response && typeof error.response.data.detail == 'string'
          ? error.response.data.detail
          : error.message
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
