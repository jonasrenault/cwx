import axios from 'axios'
import { User, TopType } from '../models/user'
import { Route } from '../models/wall'

const API_URL = import.meta.env.VITE_BACKEND_API_URL

export class RouteToppers {
  routeId: string
  toppers: { [key: TopType]: Array<User> } = {}

  constructor(routeId: string, toppers: Array<User>) {
    if (toppers) {
      toppers.forEach((user) => {
        const tops = user.tops.filter((top) => top.route._id === routeId)
        tops.forEach((top) =>
          this.toppers[top.type]
            ? this.toppers[top.type].push(user)
            : (this.toppers[top.type] = [user]),
        )
      })
    }
  }

  count(type: TopType): number {
    return this.toppers[type] ? this.toppers[type].length : 0
  }

  setToppers(type: TopType, toppers: Array<User>): void {
    this.toppers[type] = toppers
  }

  getToppers(type: TopType): Array<User> {
    return this.toppers[type]
  }

  hasTopped(type: TopType, user: User): boolean {
    return this.toppers[type] && this.toppers[type].filter((u) => u.uuid === user.uuid).length > 0
  }

  copy(): RouteToppers {
    const clone = new RouteToppers(this.routeId)
    clone.toppers = this.toppers
    return clone
  }
}

class RouteService {
  async topRoute(routeId: string, type: TopType): Promise<Route> {
    const response = await axios.post(API_URL + `routes/${routeId}/top`, { type })
    return response.data
  }

  async getRouteToppers(routeId: string, type: TopType): Promise<Array<User>> {
    const options = type ? { params: { type } } : {}
    const response = await axios.get(API_URL + `routes/${routeId}/tops`, options)
    return response.data
  }
}

export default new RouteService()
