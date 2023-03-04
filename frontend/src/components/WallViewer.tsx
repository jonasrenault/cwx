import { useRef, useEffect } from 'react'
import { Box } from '@mui/material'
import { path } from 'd3-path'
import * as d3 from 'd3'
import { Wall, Area } from '../models/wall'
import './WallViewer.css'

function drawWall(container, width: number, height: number, wall: Wall) {
  const svg = d3.select(container).select('svg').attr('width', width).attr('height', height)
  const areas = svg
    .selectAll('.u-area')
    .data(wall.areas)
    .join('g')
    .classed('u-area', true)
    .on('mouseover', function () {
      const hovered = d3.select(this)
      hovered.classed('active', true)
      d3.select(container).select('svg').selectAll('.u-border').remove()
      d3.select(container)
        .select('svg')
        .append('path')
        .classed('u-border', true)
        .style('fill', 'none')
        .attr('d', drawBorder((hovered.datum() as Area).border).toString())
    })
    .on('mouseout', function () {
      const hovered = d3.select(this)
      hovered.classed('active', false)
      d3.select(container).select('svg').selectAll('.u-border').remove()
    })

  areas
    .selectAll('.u-path')
    .data((d) => d.paths)
    .join('path')
    .classed('u-path', true)
    .style('stroke', (d) => d.color)
    .style('fill', (d) => d.color)
    .attr('d', (d) => drawShape(d).toString())
}

function drawShape(el: Shape) {
  const context = path()
  switch (el.type) {
    case 'rect': {
      const r = el as Rect
      context.rect(r.x, r.y, r.w, r.h)
      break
    }
    case 'fill': {
      const f = el as Path
      f.points.forEach((e, i) => {
        i == 0 ? context.moveTo(...e) : context.lineTo(...e)
      })
      break
    }
  }
  return context
}

function drawBorder(border: [number, number][]) {
  const context = path()
  border.forEach((e, i) => {
    i == 0 ? context.moveTo(...e) : context.lineTo(...e)
  })
  context.closePath()
  return context
}

interface WallViewProps {
  width: number
  height: number
  wall: Wall
}

export default function WallViewer(props: WallViewProps) {
  const ref = useRef<HTMLElement>()

  // const drawWall = () => {
  //   const svgElement = d3.select(ref.current).select('svg')
  //   svgElement.append('circle').attr('cx', 150).attr('cy', 70).attr('r', 50)
  // }

  useEffect(() => {
    drawWall(ref.current, props.width, props.height, props.wall)
  })

  return (
    <Box ref={ref}>
      <svg viewBox='0 0 450 200' className='u-wall' />
    </Box>
  )
}
