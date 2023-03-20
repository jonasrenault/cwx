import { Container, Grid } from '@mui/material'
import { useLoaderData, redirect, Outlet, LoaderFunctionArgs } from 'react-router-dom'
import WallCard from '../components/WallCard'
import wallService from '../services/wall.service'
import { Wall } from '../models/wall'

export async function loader({ params }: LoaderFunctionArgs) {
  try {
    const wall = await wallService.getWall(params.wallId, true)
    return { wall }
  } catch {
    return redirect('/')
  }
}

export default function WallView() {
  const { wall } = useLoaderData() as { wall: Wall }
  return (
    <Container component='main' sx={{ pt: 8, pb: 6 }}>
      <Grid container spacing={5}>
        <Grid item sm={12} md={6}>
          <WallCard wall={wall} />
        </Grid>
        <Grid item sm={12} md={6}>
          <Outlet />
        </Grid>
      </Grid>
    </Container>
  )
}
