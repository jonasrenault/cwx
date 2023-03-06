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
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { Route } from '../models/wall'

interface RouteListProprs {
  routes: Array<Route>
}

export default function RouteList(props: RouteListProprs) {
  const { routes } = props

  return (
    <List dense={true} sx={{ overflow: 'auto', maxHeight: 300 }}>
      {routes.map((route) => (
        <ListItemButton key={route._id}>
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
                {/* {route.grade} */}
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
