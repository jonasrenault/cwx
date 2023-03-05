import axios from 'axios'
import { Wall } from '../models/wall'

const API_URL = import.meta.env.VITE_BACKEND_API_URL

class WallService {
  async getWalls(): Array<Wall> {
    const response = await axios.get(API_URL + 'walls')
    return response.data
  }
}

export default new WallService()
