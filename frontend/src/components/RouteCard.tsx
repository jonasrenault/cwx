import { useEffect, useState } from 'react'
import { styled, useTheme } from '@mui/material/styles'
import * as d3 from 'd3'
import * as d3Zoom from 'd3-zoom'
import {
  Box,
  Badge,
  Stack,
  Card,
  Grid,
  CardHeader,
  CardContent,
  CardActions,
  Collapse,
  Divider,
  Avatar,
  IconButton,
  IconButtonProps,
  TextField,
  Tooltip,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline'
import FavoriteIcon from '@mui/icons-material/Favorite'
import VerifiedIcon from '@mui/icons-material/Verified'
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined'
import BookmarkAddedOutlinedIcon from '@mui/icons-material/BookmarkAddedOutlined'
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import WallViewer from './WallViewer'
import { useSnackBar } from '../contexts/snackbar'
import { Route, Wall, Top, TopType, Vote } from '../models/wall'
import routeService from '../services/route.service'
import { useAuth } from '../contexts/auth'

const API_URL = import.meta.env.VITE_BACKEND_API_URL

interface RouteCardProps {
  route: Route
  wall?: Wall
}

interface ZoomableImgProps {
  image: string
}

export function ZoomableImg({ image }: ZoomableImgProps) {
  const handleZoom = (e: d3Zoom.D3ZoomEvent<SVGSVGElement, unknown>) => {
    d3.select('svg.u-zoomable-img image').attr('transform', String(e.transform))
  }

  const setupImage = async () => {
    const img = new Image()
    img.src = image
    await img.decode()

    const svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, undefined> =
      d3.select('svg.u-zoomable-img')
    svg.selectAll('image').remove()
    svg.append('image').attr('href', image)

    svg
      .attr('viewBox', `0 0 ${img.naturalWidth} ${img.naturalHeight}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .attr('width', '100%')

    const zoom = d3Zoom
      .zoom<SVGSVGElement, unknown>()
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

interface RouteCardHeaderAvatarProps {
  route: Route
}

function RouteCardHeaderAvatar({ route }: RouteCardHeaderAvatarProps) {
  const handleVote = async (up: boolean) => {
    await routeService.voteRoute(route.id, route.grade, up)
  }

  return (
    <Badge
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      badgeContent={
        <IconButton
          aria-label='up vote route'
          size='small'
          sx={{ color: 'red' }}
          onClick={() => handleVote(true)}
        >
          <AddCircleOutlineIcon fontSize='inherit' />
        </IconButton>
      }
    >
      <Badge
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        badgeContent={
          <IconButton
            aria-label='up vote route'
            size='small'
            sx={{ color: 'green' }}
            onClick={() => handleVote(false)}
          >
            <RemoveCircleOutlineIcon fontSize='inherit' />
          </IconButton>
        }
      >
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
      </Badge>
    </Badge>
  )
}

export default function RouteCard(props: RouteCardProps) {
  const { route, wall } = props
  const { user: currentUser } = useAuth()
  const [expanded, setExpanded] = useState(false)
  const theme = useTheme()
  const [tops, setTops] = useState([])
  const { showSnackBar } = useSnackBar()

  const selectedArea = wall?.areas?.filter((area) => area.id === route.area.id)[0]

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  useEffect(() => {
    setTops(route && route.tops ? route.tops : [])
  }, [route])

  const handleTop = async (type: TopType) => {
    if (!currentUser) {
      showSnackBar(
        "Vous devez d'abord vous connecter pour pouvoir sauvegarder une voie.",
        'warning',
      )
      return
    }
    const top = await routeService.topRoute(route.id, type)
    const newTops = tops.filter((t) => t.id !== top.id)
    if (tops.length === newTops.length) {
      newTops.push(top)
    }
    setTops(newTops)
  }

  const countTops = (type: TopType) => {
    return tops ? tops.filter((t) => t.type === type).length : 0
  }

  const hasTopped = (type: TopType) => {
    return (
      currentUser &&
      tops &&
      tops.filter((t) => t.type === type && t.user.uuid === currentUser.uuid).length > 0
    )
  }

  return (
    <Card sx={{ width: '100%' }} variant='outlined'>
      <CardHeader
        avatar={<RouteCardHeaderAvatar route={route} />}
        title={route.setter}
        subheader={`Couloir ${route.lane}`}
      />

      <CardActions disableSpacing>
        <Tooltip title='Validée en tête'>
          <IconButton aria-label='top route' onClick={() => handleTop(TopType.Lead)}>
            <Badge badgeContent={countTops(TopType.Lead)} color='secondary'>
              {hasTopped(TopType.Lead) ? <VerifiedIcon /> : <VerifiedOutlinedIcon />}
            </Badge>
          </IconButton>
        </Tooltip>
        <Tooltip title='Validée en moulinette'>
          <IconButton aria-label='top roped route' onClick={() => handleTop(TopType.TopRope)}>
            <Badge badgeContent={countTops(TopType.TopRope)} color='secondary'>
              {hasTopped(TopType.TopRope) ? <BookmarkAddedIcon /> : <BookmarkAddedOutlinedIcon />}
            </Badge>
          </IconButton>
        </Tooltip>
        <Tooltip title='Projet'>
          <IconButton aria-label='project route' onClick={() => handleTop(TopType.Project)}>
            <Badge badgeContent={countTops(TopType.Project)} color='secondary'>
              {hasTopped(TopType.Project) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </Badge>
          </IconButton>
        </Tooltip>
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
        {tops && tops.filter((t) => t.type === TopType.Lead).length > 0 && (
          <Stack spacing={0} divider={<Divider flexItem />} sx={{ mt: 4 }}>
            <Typography variant='body1'>Validée par</Typography>
            <List
              sx={{ maxHeight: 450, overflow: 'auto', '::-webkit-scrollbar': { display: 'none' } }}
            >
              {tops
                .filter((t) => t.type === TopType.Lead)
                .map((top) => {
                  return (
                    <ListItem key={top.user.uuid} disablePadding>
                      <ListItemButton data-testid={top.user.uuid}>
                        <ListItemAvatar>
                          <Avatar
                            alt={top.user.first_name + ' ' + top.user.last_name}
                            src={top.user.picture && top.user.picture}
                          />
                        </ListItemAvatar>
                        <ListItemText primary={top.user.first_name + ' ' + top.user.last_name} />
                      </ListItemButton>
                    </ListItem>
                  )
                })}
            </List>
          </Stack>
        )}
      </CardContent>
    </Card>
  )
}
