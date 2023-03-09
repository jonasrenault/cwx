import * as React from 'react'
import {
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Collapse,
  Avatar,
  IconButton,
  Typography,
} from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import ShareIcon from '@mui/icons-material/Share'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { Route } from '../models/wall'

interface RouteCardProps {
  route: Route
}

export default function RouteCard(props: RouteCardProps) {
  const { route } = props
  const [expanded, setExpanded] = React.useState(false)

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
          <IconButton aria-label='show more'>
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
        <CardMedia
          component='img'
          height='194'
          image='/static/images/cards/paella.jpg'
          alt='Paella dish'
        />
        <CardContent>
          <Typography paragraph>Method:</Typography>
          <Typography paragraph>
            Heat 1/2 cup of the broth in a pot until simmering, add saffron and set aside for 10
            minutes.
          </Typography>
          <Typography paragraph>
            Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over medium-high
            heat. Add chicken, shrimp and chorizo, and cook, stirring occasionally until lightly
            browned, 6 to 8 minutes. Transfer shrimp to a large plate and set aside, leaving chicken
            and chorizo in the pan. Add pimentón, bay leaves, garlic, tomatoes, onion, salt and
            pepper, and cook, stirring often until thickened and fragrant, about 10 minutes. Add
            saffron broth and remaining 4 1/2 cups chicken broth; bring to a boil.
          </Typography>
          <Typography paragraph>
            Add rice and stir very gently to distribute. Top with artichokes and peppers, and cook
            without stirring, until most of the liquid is absorbed, 15 to 18 minutes. Reduce heat to
            medium-low, add reserved shrimp and mussels, tucking them down into the rice, and cook
            again without stirring, until mussels have opened and rice is just tender, 5 to 7
            minutes more. (Discard any mussels that don&apos;t open.)
          </Typography>
          <Typography>
            Set aside off of the heat to let rest for 10 minutes, and then serve.
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  )
}
