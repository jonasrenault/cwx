import { Container, Box, Typography, Grid, Card, CardHeader, CardContent } from '@mui/material'
import { useLoaderData, redirect } from 'react-router-dom'
import { Wall } from '../models/wall'
import WallViewer from '../components/WallViewer'
import RouteList from '../components/RouteList'
import wallService from '../services/wall.service'

export async function loader() {
  try {
    const walls = await wallService.getWalls(true)
    return { walls }
  } catch {
    return redirect('/')
  }
}

export default function Home() {
  const { walls } = useLoaderData<Array<Wall>>()
  return (
    <Box>
      {/* Hero unit */}
      <Container disableGutters maxWidth='sm' component='main' sx={{ pt: 8, pb: 6 }}>
        <Typography component='h1' variant='h2' align='center' color='text.primary' gutterBottom>
          Paris Wall eXplorer
        </Typography>
      </Container>

      {/* End hero unit */}
      <Container maxWidth='md' component='main'>
        <Grid container spacing={5} alignItems='flex-end'>
          {walls.map((wall) => (
            // Enterprise card is full width at sm breakpoint
            <Grid item key={wall.key} xs={12} sm={12} md={6}>
              <Card>
                <CardHeader
                  title={wall.name}
                  subheader={wall.city}
                  titleTypographyProps={{ align: 'center' }}
                  subheaderTypographyProps={{
                    align: 'center',
                  }}
                />
                <CardContent>
                  <Box>
                    <WallViewer wall={wall} />
                  </Box>
                  {wall.routes && <RouteList routes={wall.routes} />}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}
