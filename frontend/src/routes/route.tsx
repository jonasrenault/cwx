import { useRouteLoaderData, useParams } from 'react-router-dom'
import RouteCard from '../components/RouteCard'
import { Wall } from '../models/wall'

export default function RouteView() {
  // RouteView should render inside a WallView which loads a Wall with routes
  const { wall } = useRouteLoaderData('wall') as { wall: Wall }
  const { routeId } = useParams()
  const route = wall.routes.filter((route) => route._id === routeId)[0]

  return <RouteCard route={route} wall={wall}></RouteCard>
}
