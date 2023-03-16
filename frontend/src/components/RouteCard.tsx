import { useEffect, useState } from 'react'
import { styled, useTheme } from '@mui/material/styles'
import * as d3 from 'd3'
import {
  Box,
  Stack,
  Card,
  Grid,
  CardHeader,
  CardContent,
  CardActions,
  Collapse,
  Avatar,
  IconButton,
  TextField,
} from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import ShareIcon from '@mui/icons-material/Share'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import WallViewer from './WallViewer'
import { Route, Wall } from '../models/wall'

const API_URL = import.meta.env.VITE_BACKEND_API_URL

interface RouteCardProps {
  route: Route
  wall?: Wall
}

export function ZoomableImg({ image }) {
  const handleZoom = (e) => {
    d3.select('svg.u-zoomable-img image').attr('transform', e.transform)
  }

  const setupImage = async () => {
    const img = new Image()
    img.src = image
    await img.decode()

    const svg = d3.select('svg.u-zoomable-img')
    svg.selectAll('image').remove()
    svg.append('image').attr('href', image)

    svg
      .attr('viewBox', `0 0 ${img.naturalWidth} ${img.naturalHeight}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .attr('width', '100%')

    const zoom = d3
      .zoom()
      .on('zoom', handleZoom)
      .scaleExtent([1, 5])
      .translateExtent([
        [0, 0],
        [img.naturalWidth, img.naturalHeight],
      ])
    svg.call(zoom)
  }

  useEffect(() => {
    setupImage()
  }, [image])

  return <svg className='u-zoomable-img'></svg>
}

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props
  return <IconButton {...other} />
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(-90deg)' : 'rotate(0deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.complex,
  }),
}))

export default function RouteCard(props: RouteCardProps) {
  const { route, wall } = props
  const [expanded, setExpanded] = useState(false)
  const theme = useTheme()

  const selectedArea = wall?.areas?.filter((area) => area._id === route.area.id)[0]

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  return (
    <Card sx={{ width: '100%' }} variant='outlined'>
      <CardHeader
        avatar={
          <Avatar
            sx={{
              bgcolor: route.color === 'yellow' ? '#ffeb3b' : route.color,
              color: ['white', 'yellow'].indexOf(route.color) >= 0 ? '#000' : 'palette.primary',
              border: route.color === 'white' ? '2px solid' : 'none',
              fontSize: route.grade.length > 3 ? '.8rem' : '1.25rem',
            }}
            aria-label='recipe'
          >
            {route.grade.split('').map((c) => (c === '+' ? <sup key={c}>+</sup> : c))}
          </Avatar>
        }
        title={route.setter}
        subheader={`Couloir ${route.lane}`}
      />

      <CardActions disableSpacing>
        <IconButton aria-label='add to favorites'>
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label='share'>
          <ShareIcon />
        </IconButton>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label='show more'
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <CardContent>
        <Collapse in={!expanded} timeout={theme.transitions.duration.complex} unmountOnExit>
          <Grid container spacing={1}>
            {wall && (
              <Grid item sm={6}>
                <Stack>
                  <WallViewer wall={wall} selectedArea={selectedArea} disabled={true} />
                  {selectedArea && (
                    <Box sx={{ my: 1 }}>
                      <TextField
                        disabled
                        label='Secteur'
                        value={selectedArea.name}
                        variant='standard'
                        sx={{ width: 1.0 }}
                      />
                    </Box>
                  )}
                </Stack>
              </Grid>
            )}
            {route.img_path && (
              <Grid item sm={6} sx={{ maxHeight: '30vh' }}>
                <div
                  style={{
                    backgroundImage: `url(${API_URL}static/${route.img_path})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    width: '100%',
                    height: '100%',
                    borderRadius: '15px',
                  }}
                />
              </Grid>
            )}
          </Grid>
        </Collapse>
        <Collapse in={expanded} timeout={theme.transitions.duration.complex} unmountOnExit>
          <Box sx={{ borderRadius: '15px', overflow: 'hidden' }}>
            {route.img_path && <ZoomableImg image={`${API_URL}static/${route.img_path}`} />}
          </Box>
        </Collapse>
      </CardContent>
    </Card>
  )
}
