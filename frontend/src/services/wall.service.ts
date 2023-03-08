import axios from 'axios'
import { Wall } from '../models/wall'

const API_URL = import.meta.env.VITE_BACKEND_API_URL

class WallService {
  async getWalls(fetchRoutes = false): Array<Wall> {
    const options = fetchRoutes ? { params: { fetch_routes: 1 } } : {}
    const response = await axios.get(API_URL + 'walls', options)
    return response.data
  }

  async getWallRoutes(wallId): Array<Route> {
    const response = await axios.get(API_URL + `walls/${wallId}/routes`)
    return response.data
  }
}

export default new WallService()
