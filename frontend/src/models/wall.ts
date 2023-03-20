export interface Wall {
  _id: string
  id?: string
  key: string
  name: string
  city: string
  description: string
  areas?: Area[]
  routes?: Route[]
}

export interface Area {
  _id: string
  id?: string
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
  _id: string
  grade: string
  color: string
  lane: string
  setter: string
  set_on: Date
  removed_on: Date
  img_path?: string
  area: Area
  wall: Wall
}
