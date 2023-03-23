import { useState, useMemo, useEffect, useCallback, ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
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
import { Wall, Area, Route } from '../models/wall'
import WallViewer from './WallViewer'
import RouteList from './RouteList'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'

interface WallCardProps {
  wall: Wall
}

export default function WallCard(props: WallCardProps) {
  const { wall } = props
  const [routes, setRoutes] = useState(wall.routes)
  const [query, setQuery] = useState('')
  const [selectedArea, setSelectedArea] = useState(null)
  const navigate = useNavigate()
  const options = {
    threshold: 0.2,
    keys: ['setter', 'grade'],
  }
  const fuse = new Fuse(routes, options)

  const search = (textQuery: string, area: Area) => {
    let searchRoutes
    if (textQuery) {
      searchRoutes = fuse.search(textQuery).map((item) => item.item)
      setRoutes([])
    } else {
      searchRoutes = wall.routes
    }

    if (area) {
      searchRoutes = searchRoutes.filter((route) => route.area.id === area.id)
    }
    setRoutes(searchRoutes)
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
    debouncedSearchHandler(event.target.value, selectedArea)
  }

  const handleClearSearch = () => {
    setQuery('')
    debouncedSearchHandler('', selectedArea)
  }

  const handleAreaSelected = (area: Area) => {
    setSelectedArea(area)
    debouncedSearchHandler(query, area)
  }

  const handleClearArea = () => {
    setSelectedArea(null)
    debouncedSearchHandler(query, null)
  }

  const debouncedSearchHandler = useMemo(() => debounce(search, 300), [setRoutes])

  useEffect(() => {
    return () => {
      debouncedSearchHandler.cancel()
    }
  }, [debouncedSearchHandler])

  const onRouteClick = useCallback((route: Route) => {
    navigate(`/wall/${wall.id}/${route.id}`)
  }, [])

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
        <Box sx={{ my: 1 }}>
          <WallViewer wall={wall} selectedArea={selectedArea} onAreaSelected={handleAreaSelected} />
        </Box>

        {selectedArea && (
          <Box sx={{ my: 1 }}>
            <TextField
              disabled
              label='Secteur'
              value={selectedArea.name}
              variant='standard'
              sx={{ width: 1.0 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      aria-label='clear area'
                      onClick={handleClearArea}
                      edge='end'
                      // color='text.secondary'
                      size='small'
                    >
                      <ClearIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        )}

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
                <IconButton
                  aria-label='clear search'
                  onClick={handleClearSearch}
                  edge='end'
                  size='small'
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {routes && <RouteList routes={routes} handleRouteClick={onRouteClick} />}
      </CardContent>
    </Card>
  )
}
