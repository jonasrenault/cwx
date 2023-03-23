import axios from 'axios'
import { Route, TopType, Top, Vote } from '../models/wall'

const API_URL = import.meta.env.VITE_BACKEND_API_URL

const GRADES: str[] = [
  '4',
  '4a',
  '4a+',
  '4b',
  '4b+',
  '4c',
  '4c+',
  '5a',
  '5a+',
  '5b',
  '5b+',
  '5c',
  '5c+',
  '6a',
  '6a+',
  '6b',
  '6b+',
  '6c',
  '6c+',
  '7a',
  '7a+',
  '7b',
  '7b+',
  '7c',
  '7c+',
  '8a',
  '8a+',
  '8b',
  '8b+',
  '8c',
  '8c+',
  '9a',
  '9a+',
  '9b',
  '9b+',
  '9c',
  '9c+',
]

function upVoteRoute(grade: string, up: boolean) {
  let g = grade
  while (GRADES.indexOf(g) < 0 && g.length > 2) {
    g = g.slice(0, -1)
  }
  const idx = GRADES.indexOf(g)
  if (idx < 0) return null
  if (up) return idx === GRADES.length ? GRADES[idx] : GRADES[idx + 1]
  return idx === 0 ? GRADES[0] : GRADES[idx - 1]
}

class RouteService {
  async topRoute(routeId: string, type: TopType): Promise<Top> {
    const response = await axios.post(API_URL + `routes/${routeId}/top`, { type })
    return response.data
  }

  async getRoute(routeId: string): Promise<Route> {
    const response = await axios.get(API_URL + `routes/${routeId}`)
    return response.data
  }

  async voteRoute(routeId: string, currentGrade: string, up: boolean): Promise<Vote> {
    const grade = upVoteRoute(currentGrade, up)
    const response = await axios.post(API_URL + `routes/${routeId}/vote`, { grade })
    return response.data
  }
}

export default new RouteService()
