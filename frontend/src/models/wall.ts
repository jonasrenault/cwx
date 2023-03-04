export interface Wall {
  id: string
  name: string
  city: string
  areas: Area[]
  routes?: Route[]
}

export interface Area {
  name: string
  paths: Array<Shape>
  border: [number, number][]
}

export interface Shape {
  type: string
  color: string
}

export interface Rect extends Shape {
  x: number
  y: number
  w: number
  h: number
}

export interface Path extends Shape {
  points: [number, number][]
}

export interface Route {
  id: string
  grade: string
  color: string
  lane: string
  area: string
  setter: string
  set: Date
  removed: Date
}
