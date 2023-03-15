import { useEffect, useState } from 'react'
import * as d3 from 'd3'
import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Collapse,
  Avatar,
  IconButton,
} from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import ShareIcon from '@mui/icons-material/Share'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Route } from '../models/wall'

const API_URL = import.meta.env.VITE_BACKEND_API_URL

interface RouteCardProps {
  route: Route
}

export function ZoomableImg({ image, width, height }) {
  const handleZoom = (e) => {
    d3.select('svg.u-zoomable-img image').attr('transform', e.transform)
  }

  const setupImage = async () => {
    const img = new Image()
    img.src = image
    await img.decode()
    console.log(img.naturalHeight)
    console.log(img.naturalWidth)

    const svg = d3.select('svg.u-zoomable-img')
    svg.selectAll('image').remove()
    svg.append('image').attr('href', image)

    svg
      .attr('viewBox', `0 0 ${img.naturalWidth} ${img.naturalHeight}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      // .attr('height', '600px')
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

export default function RouteCard(props: RouteCardProps) {
  const { route } = props
  const [expanded, setExpanded] = useState(true)

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
        action={
          <IconButton aria-label='show more' onClick={handleExpandClick}>
            <ExpandMoreIcon />
          </IconButton>
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
      </CardActions>
      <Collapse in={expanded} timeout='auto' unmountOnExit>
        <CardContent>
          {route.img_path && (
            <ZoomableImg
              image={`${API_URL}static/${route.img_path}`}
              alt={route.color + ' ' + route.lane}
            />
          )}
        </CardContent>
      </Collapse>
    </Card>
  )
}
