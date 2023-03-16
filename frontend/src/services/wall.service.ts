import axios from 'axios'
import { Wall, Route } from '../models/wall'

const API_URL = import.meta.env.VITE_BACKEND_API_URL

class WallService {
  async getWalls(fetchRoutes = false): Promise<Array<Wall>> {
    const options = fetchRoutes ? { params: { fetch_routes: 1 } } : {}
    const response = await axios.get(API_URL + 'walls', options)
    return response.data
  }

  async getWall(wallId: string, fetchRoutes = false): Promise<Wall> {
    const options = fetchRoutes ? { params: { fetch_routes: 1 } } : {}
    const response = await axios.get(API_URL + `walls/${wallId}`, options)
    return response.data
  }

  /**
   * Method currently unused as we always fetch routes when getting walls
   * @param wallId
   * @returns
   */
  async getWallRoutes(wallId: string): Promise<Array<Route>> {
    const response = await axios.get(API_URL + `walls/${wallId}/routes`)
    return response.data
  }
}

export default new WallService()
