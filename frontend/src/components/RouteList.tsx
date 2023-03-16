import * as React from 'react'
import {
  List,
  ListItem,
  IconButton,
  ListItemAvatar,
  ListItemButton,
  Avatar,
  ListItemText,
} from '@mui/material'
import { useParams } from 'react-router-dom'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { Route } from '../models/wall'

interface RouteListProprs {
  routes: Array<Route>
  handleRouteClick: (route: Route) => void
}

export default function RouteList(props: RouteListProprs) {
  const { routes, handleRouteClick } = props
  const { routeId: activeRouteId } = useParams()

  return (
    <List dense={true} sx={{ overflow: 'auto', maxHeight: 300 }}>
      {routes.map((route) => (
        <ListItemButton
          key={route._id}
          onClick={() => handleRouteClick(route)}
          selected={route._id === activeRouteId}
          autoFocus={route._id === activeRouteId}
        >
          <ListItem
            secondaryAction={
              <IconButton edge='end' aria-label='favorite'>
                <FavoriteBorderIcon />
              </IconButton>
            }
          >
            <ListItemAvatar>
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
            </ListItemAvatar>
            <ListItemText primary={route.setter} secondary={`Couloir ${route.lane}`} />
          </ListItem>
        </ListItemButton>
      ))}
    </List>
  )
}
