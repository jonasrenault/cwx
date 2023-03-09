import { Container, Grid } from '@mui/material'
import { useLoaderData, useRouteLoaderData, useParams } from 'react-router-dom'
import { Wall } from '../models/wall'
import WallCard from '../components/WallCard'
import wallService from '../services/wall.service'
import RouteCard from '../components/RouteCard'

export default function RouteView() {
  // RouteView should render inside a WallView which loads a Wall with routes
  const { wall } = useRouteLoaderData('wall')
  const { routeId } = useParams()
  const route = wall.routes.filter((route) => route._id === routeId)[0]

  return <RouteCard route={route}></RouteCard>
}
