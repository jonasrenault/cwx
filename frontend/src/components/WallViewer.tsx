import { useRef, useState } from 'react'
import { Box } from '@mui/material'
import { path } from 'd3-path'
import * as d3 from 'd3'
import { Wall, Area } from '../models/wall'
import './WallViewer.css'

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
  width?: number
  height?: number
  wall: Wall
  selectedArea?: Area
  onAreaSelected: (area: Area) => void
}

export default function WallViewer(props: WallViewProps) {
  const ref = useRef<HTMLElement>()

  // compute viewbox
  const xValues = props.wall.areas.map((area) => area.border.map((border) => border[0])).flat(1)
  const yValues = props.wall.areas.map((area) => area.border.map((border) => border[1])).flat(1)
  const [xmin, xmax] = d3.extent(xValues)
  const [ymin, ymax] = d3.extent(yValues)

  const [highlightedArea, setHighlightedArea] = useState(null)

  const handleMouseEnter = (area: Area) => {
    setHighlightedArea(area)
  }

  const handleMouseLeave = () => {
    setHighlightedArea(null)
  }

  return (
    <Box ref={ref} sx={{ width: props.width, height: props.height }} className='svg-container'>
      <svg
        className='u-wall'
        width={props.width}
        height={props.height}
        preserveAspectRatio='xMidYMid meet'
        viewBox={`${xmin} ${ymin} ${xmax - xmin} ${ymax - ymin}`}
      >
        {props.wall.areas?.map((area) => (
          <g
            className={'u-area' + (props.selectedArea?._id === area._id ? ' selected' : '')}
            key={area._id}
            onMouseOver={() => handleMouseEnter(area)}
            onMouseLeave={() => handleMouseLeave()}
            onClick={() => props.onAreaSelected(area)}
          >
            {area.paths.map((path) => (
              <path
                key={drawShape(path).toString()}
                className={'u-path'}
                stroke={path.color}
                fill={path.color}
                d={drawShape(path).toString()}
              ></path>
            ))}
          </g>
        ))}
        {highlightedArea && (
          <path className='u-border' d={drawBorder(highlightedArea.border).toString()} />
        )}
      </svg>
    </Box>
  )
}
