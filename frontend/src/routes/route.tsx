import { useRouteLoaderData, useLoaderData, redirect } from 'react-router-dom'
import RouteCard from '../components/RouteCard'
import { Wall } from '../models/wall'
import routeService from '../services/route.service'

export async function loader({ params }: LoaderFunctionArgs) {
  try {
    const route = await routeService.getRoute(params.routeId)
    return { route }
  } catch {
    return redirect('/')
  }
}

export default function RouteView() {
  // RouteView should render inside a WallView which loads a Wall with routes
  const { wall } = useRouteLoaderData('wall') as { wall: Wall }
  const { route } = useLoaderData() as { route: Route }

  return <RouteCard route={route} wall={wall}></RouteCard>
}
