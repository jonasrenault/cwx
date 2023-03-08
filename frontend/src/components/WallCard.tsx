import * as React from 'react'
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  TextField,
  InputAdornment,
  IconButton,
} from '@mui/material'
import Fuse from 'fuse.js'
import debounce from 'lodash.debounce'
import { Wall } from '../models/wall'
import WallViewer from './WallViewer'
import RouteList from './RouteList'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'

interface WallCardProps {
  wall: Wall
}

export default function WallCard(props: WallCardProps) {
  const { wall } = props
  const [routes, setRoutes] = React.useState(wall.routes)
  const [query, setQuery] = React.useState('')
  const options = {
    threshold: 0.2,
    keys: ['setter', 'grade'],
  }
  const fuse = new Fuse(routes, options)

  const search = (searchQuery) => {
    if (searchQuery) {
      setRoutes(fuse.search(searchQuery).map((item) => item.item))
    } else {
      setRoutes(wall.routes)
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
    debouncedSearchHandler(event.target.value)
  }

  const handleClearSearch = () => {
    setQuery('')
    debouncedSearchHandler('')
  }

  const debouncedSearchHandler = React.useMemo(() => debounce(search, 300), [setRoutes])

  return (
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

        <TextField
          sx={{ width: 1.0, py: 1 }}
          value={query}
          onInput={handleChange}
          variant='outlined'
          placeholder='Recherche...'
          size='small'
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: query && (
              <InputAdornment position='end'>
                <IconButton aria-label='clear search' onClick={handleClearSearch} edge='end'>
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {routes && <RouteList routes={routes} />}
      </CardContent>
    </Card>
  )
}
