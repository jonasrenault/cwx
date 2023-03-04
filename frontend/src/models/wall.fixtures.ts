import type { Area, Rect, Path, Wall, Route } from './wall'

const petitDeversG: Area = {
  name: 'petit devers gauche',
  paths: [
    { type: 'rect', x: 20, y: 45, w: 43, h: 135, color: '#FFA500' } as Rect,
    { type: 'rect', x: 52, y: 45, w: 11, h: 97, color: 'rgb(219, 233, 224)' } as Rect,
    {
      type: 'fill',
      points: [
        [42, 45],
        [52, 140],
        [52, 45],
        [42, 45],
      ],
      color: 'rgb(167, 181, 161)',
    } as Path,
  ],
  border: [
    [20, 45],
    [63, 45],
    [63, 180],
    [20, 180],
  ],
}

const cirqueG: Area = {
  name: 'cirque gauche',
  paths: [
    {
      type: 'fill',
      points: [
        [63, 45],
        [68, 45],
        [93, 142],
        [63, 142],
      ],
      color: 'rgb(219, 233, 224)',
    } as Path,
    {
      type: 'fill',
      points: [
        [68, 45],
        [74, 45],
        [100, 77],
        [93, 142],
      ],
      color: 'rgb(238, 238, 167)',
    } as Path,
    {
      type: 'fill',
      points: [
        [74, 45],
        [100, 77],
        [100, 24],
      ],
      color: 'rgb(167, 181, 161)',
    } as Path,
    { type: 'rect', x: 63, y: 143, w: 30, h: 37, color: '#FFA500' } as Rect,
  ],
  border: [
    [63, 45],
    [74, 45],
    [100, 24],
    [100, 77],
    [93, 180],
    [63, 180],
  ],
}

const proue: Area = {
  name: 'proue',
  paths: [
    {
      type: 'fill',
      points: [
        [100, 24],
        [112, 14],
        [117, 39],
      ],
      color: 'rgb(219, 233, 224)',
    } as Path,
    {
      type: 'fill',
      points: [
        [100, 24],
        [100, 77],
        [129, 77],
      ],
      color: 'rgb(227, 220, 128)',
    } as Path, // jaune foncé
    {
      type: 'fill',
      points: [
        [100, 24],
        [117, 39],
        [129, 77],
      ],
      color: 'rgb(238, 238, 167)',
    } as Path,
    {
      type: 'fill',
      points: [
        [100, 77],
        [100, 82],
        [132, 82],
        [129, 77],
      ],
      color: 'rgb(92, 45, 45)',
    } as Path,
    {
      type: 'fill',
      points: [
        [100, 82],
        [93, 142],
        [112, 106],
        [132, 82],
      ],
      color: 'rgb(227, 220, 128)',
    } as Path,
    {
      type: 'fill',
      points: [
        [93, 142],
        [112, 106],
        [132, 82],
        [132, 87],
      ],
      color: 'rgb(92, 45, 45)',
    } as Path, // rouge
    {
      type: 'fill',
      points: [
        [112, 14],
        [117, 39],
        [161, 45],
        [161, 14],
      ],
      color: 'rgb(219, 233, 224)',
    } as Path, // gris vert
    {
      type: 'fill',
      points: [
        [117, 39],
        [161, 45],
        [129, 77],
      ],
      color: 'rgb(227, 220, 128)',
    } as Path, // jaune foncé
    {
      type: 'fill',
      points: [
        [129, 77],
        [161, 45],
        [161, 74],
      ],
      color: 'rgb(238, 238, 167)',
    } as Path,
    {
      type: 'fill',
      points: [
        [129, 77],
        [132, 82],
        [132, 87],
        [161, 82],
        [161, 74],
      ],
      color: 'rgb(92, 45, 45)',
    } as Path, // rouge
    {
      type: 'fill',
      points: [
        [93, 142],
        [132, 87],
        [161, 82],
        [161, 110],
      ],
      color: 'rgb(219, 233, 224)',
    } as Path,
    {
      type: 'fill',
      points: [
        [93, 142],
        [161, 110],
        [161, 143],
      ],
      color: 'rgb(238, 238, 167)',
    } as Path,
    { type: 'rect', x: 93, y: 143, w: 68, h: 37, color: '#FFA500' } as Rect,
  ],
  border: [
    [100, 24],
    [112, 14],
    [161, 14],
    [161, 180],
    [93, 180],
    [100, 77],
  ],
}

const cirqueD: Area = {
  name: 'cirque droit',
  paths: [
    {
      type: 'fill',
      points: [
        [161, 14],
        [161, 45],
        [183, 73],
        [187, 30],
      ],
      color: 'rgb(167, 181, 161)',
    } as Path, // gris vert fonce
    {
      type: 'fill',
      points: [
        [187, 30],
        [183, 73],
        [216, 65],
        [203, 40],
      ],
      color: 'rgb(219, 233, 224)',
    } as Path,
    {
      type: 'fill',
      points: [
        [161, 45],
        [161, 74],
        [183, 73],
      ],
      color: 'rgb(238, 238, 167)',
    } as Path, // jaune clair
    {
      type: 'fill',
      points: [
        [161, 74],
        [161, 82],
        [216, 74],
        [216, 65],
        [183, 73],
      ],
      color: 'rgb(92, 45, 45)',
    } as Path,
    {
      type: 'fill',
      points: [
        [161, 82],
        [161, 110],
        [216, 124],
        [216, 74],
      ],
      color: 'rgb(219, 233, 224)',
    } as Path,
    {
      type: 'fill',
      points: [
        [161, 110],
        [161, 143],
        [216, 143],
        [216, 124],
      ],
      color: 'rgb(238, 238, 167)',
    } as Path,
    { type: 'rect', x: 161, y: 143, w: 55, h: 37, color: '#FFA500' } as Rect,
  ],
  border: [
    [161, 14],
    [203, 40],
    [216, 65],
    [216, 180],
    [161, 180],
  ],
}

const petitToit: Area = {
  name: 'petit toit',
  paths: [
    {
      type: 'fill',
      points: [
        [203, 40],
        [224, 45],
        [216, 65],
      ],
      color: 'rgb(167, 181, 161)',
    } as Path, // gris vert fonce
    {
      type: 'fill',
      points: [
        [224, 45],
        [216, 65],
        [251, 85],
      ],
      color: 'rgb(219, 233, 224)',
    } as Path,
    {
      type: 'fill',
      points: [
        [224, 45],
        [251, 85],
        [266, 101],
        [266, 45],
      ],
      color: 'rgb(238, 238, 167)',
    } as Path,
    {
      type: 'fill',
      points: [
        [216, 65],
        [216, 74],
        [266, 111],
        [266, 101],
        [251, 85],
      ],
      color: 'rgb(92, 45, 45)',
    } as Path, // rouge
    {
      type: 'fill',
      points: [
        [216, 74],
        [216, 124],
        [246, 143],
        [266, 153],
        [266, 111],
      ],
      color: 'rgb(219, 233, 224)',
    } as Path,
    {
      type: 'fill',
      points: [
        [216, 124],
        [216, 143],
        [246, 143],
      ],
      color: 'rgb(238, 238, 167)',
    } as Path, // jaune clair
    {
      type: 'fill',
      points: [
        [216, 143],
        [216, 180],
        [266, 180],
        [266, 153],
        [246, 143],
      ],
      color: '#FFA500',
    } as Path,
  ],
  border: [
    [203, 40],
    [224, 45],
    [266, 45],
    [266, 180],
    [216, 180],
    [216, 65],
  ],
}

const petitDeversD: Area = {
  name: 'petit devers gauche',
  paths: [
    {
      type: 'fill',
      points: [
        [266, 45],
        [295, 45],
        [295, 143],
      ],
      color: 'rgb(219, 233, 224)',
    } as Path,
    {
      type: 'fill',
      points: [
        [266, 45],
        [266, 101],
        [295, 143],
      ],
      color: 'rgb(238, 238, 167)',
    } as Path, // jaune clair
    {
      type: 'fill',
      points: [
        [266, 101],
        [266, 111],
        [295, 143],
      ],
      color: 'rgb(92, 45, 45)',
    } as Path, // rouge
    {
      type: 'fill',
      points: [
        [266, 111],
        [266, 153],
        [295, 180],
        [295, 143],
      ],
      color: 'rgb(219, 233, 224)',
    } as Path,
    {
      type: 'fill',
      points: [
        [266, 153],
        [266, 180],
        [295, 180],
      ],
      color: '#FFA500',
    } as Path,
    { type: 'rect', x: 295, y: 45, w: 35, h: 135, color: '#FFA500' } as Rect,
  ],
  border: [
    [266, 45],
    [330, 45],
    [330, 180],
    [266, 180],
  ],
}

export const laPlaine: Wall = {
  id: 'laplaine',
  name: 'La Plaine',
  city: 'Paris XVe',
  areas: [petitDeversG, cirqueG, proue, cirqueD, petitToit, petitDeversD],
}

const bloc: Area = {
  name: 'bloc',
  paths: [
    {
      type: 'fill',
      points: [
        [6, 71],
        [62, 80],
        [12, 130],
        [42, 150],
        [6, 150],
      ],
      color: 'rgb(120, 100, 100)',
    } as Path, // gris
    {
      type: 'fill',
      points: [
        [62, 80],
        [12, 130],
        [42, 150],
        [90, 122],
      ],
      color: '#FFA500',
    } as Path,
    {
      type: 'fill',
      points: [
        [42, 150],
        [90, 122],
        [130, 122],
        [191, 144],
        [193, 150],
      ],
      color: 'rgb(120, 100, 100)',
    } as Path, // gris
    {
      type: 'fill',
      points: [
        [62, 80],
        [99, 76],
        [90, 122],
      ],
      color: 'rgb(32, 74, 117)',
    } as Path, // bleue clair
    {
      type: 'fill',
      points: [
        [99, 76],
        [122, 76],
        [130, 122],
        [90, 122],
      ],
      color: 'rgb(18, 43, 73)',
    } as Path, // bleue fonce
    {
      type: 'fill',
      points: [
        [122, 76],
        [130, 122],
        [153, 81],
      ],
      color: 'rgb(32, 74, 117)',
    } as Path, // bleue clair
    {
      type: 'fill',
      points: [
        [153, 81],
        [130, 122],
        [191, 92],
      ],
      color: '#FFA500',
    } as Path,
    {
      type: 'fill',
      points: [
        [153, 81],
        [193, 81],
        [191, 92],
      ],
      color: 'rgb(32, 74, 117)',
    } as Path, // bleue clair
    {
      type: 'fill',
      points: [
        [130, 122],
        [191, 92],
        [191, 144],
      ],
      color: 'rgb(32, 74, 117)',
    } as Path, // bleue clair
    {
      type: 'fill',
      points: [
        [193, 81],
        [191, 92],
        [202, 99],
      ],
      color: 'rgb(18, 43, 73)',
    } as Path, // bleue fonce
    {
      type: 'fill',
      points: [
        [191, 92],
        [202, 99],
        [191, 144],
      ],
      color: 'rgb(18, 43, 73)',
    } as Path, // bleue fonce
  ],
  border: [
    [6, 71],
    [6, 150],
    [193, 150],
    [191, 144],
    [202, 99],
    [193, 81],
    [153, 81],
    [122, 76],
    [99, 76],
    [62, 80],
  ],
}

const cirqueGCN: Area = {
  name: 'cirque gauche',
  paths: [
    {
      type: 'fill',
      points: [
        [193, 54],
        [214, 54],
        [240, 135],
        [240, 150],
        [193, 150],
        [191, 144],
        [202, 99],
        [193, 81],
      ],
      color: 'rgb(167, 153, 131)',
    } as Path, // gris
    {
      type: 'fill',
      points: [
        [214, 54],
        [240, 45],
        [240, 135],
      ],
      color: 'rgb(18, 43, 73)',
    } as Path, // bleue fonce
  ],
  border: [
    [193, 54],
    [214, 54],
    [240, 45],
    [240, 150],
    [193, 150],
    [191, 144],
    [202, 99],
    [193, 81],
  ],
}

const proueCN: Area = {
  name: 'proue',
  paths: [
    {
      type: 'fill',
      points: [
        [240, 45],
        [286, 45],
        [285, 88],
        [240, 135],
      ],
      color: 'rgb(32, 74, 117)',
    } as Path, // bleue clair
    {
      type: 'fill',
      points: [
        [240, 135],
        [285, 88],
        [285, 95],
      ],
      color: '#FFA500',
    } as Path,
    {
      type: 'fill',
      points: [
        [240, 135],
        [285, 95],
        [285, 150],
        [240, 150],
      ],
      color: 'rgb(120, 100, 100)',
    } as Path, // gris
  ],
  border: [
    [240, 45],
    [286, 45],
    [285, 88],
    [285, 150],
    [240, 150],
  ],
}

const cirqueDCN: Area = {
  name: 'cirque droit',
  paths: [
    {
      type: 'fill',
      points: [
        [286, 45],
        [309, 54],
        [303, 78],
        [285, 95],
        [285, 88],
      ],
      color: '#FFA500',
    } as Path,
    {
      type: 'fill',
      points: [
        [309, 54],
        [329, 54],
        [329, 150],
        [285, 150],
        [285, 95],
        [303, 78],
      ],
      color: 'rgb(120, 100, 100)',
    } as Path, // gris
  ],
  border: [
    [286, 45],
    [309, 54],
    [329, 54],
    [329, 150],
    [285, 150],
    [285, 88],
  ],
}

const dalle: Area = {
  name: 'dalle',
  paths: [
    {
      type: 'fill',
      points: [
        [329, 54],
        [335, 54],
        [329, 150],
      ],
      color: 'rgb(120, 100, 100)',
    } as Path, // gris
    {
      type: 'fill',
      points: [
        [335, 54],
        [329, 150],
        [344, 150],
      ],
      color: 'rgb(18, 43, 73)',
    } as Path, // bleue fonce
    {
      type: 'fill',
      points: [
        [335, 54],
        [385, 54],
        [344, 150],
      ],
      color: 'rgb(32, 74, 117)',
    } as Path, // bleue clair
    {
      type: 'fill',
      points: [
        [385, 54],
        [344, 150],
        [400, 150],
      ],
      color: '#FFA500',
    } as Path,
    {
      type: 'fill',
      points: [
        [385, 54],
        [400, 150],
        [404, 150],
      ],
      color: 'rgb(200, 109, 47)',
    } as Path,
  ],
  border: [
    [329, 54],
    [385, 54],
    [404, 150],
    [329, 150],
  ],
}

const vertD: Area = {
  name: 'vertical droit',
  paths: [
    {
      type: 'fill',
      points: [
        [385, 54],
        [436, 54],
        [436, 150],
        [404, 150],
      ],
      color: 'rgb(120, 100, 100)',
    } as Path, // gris
  ],
  border: [
    [385, 54],
    [436, 54],
    [436, 150],
    [404, 150],
  ],
}

const routesCN = [
  { id: '1', lane: '1', grade: '5a', color: 'blue', setter: 'Guillaume', area: 'cirque gauche' },
  { id: '2', lane: '1', grade: '5b', color: 'orange', setter: 'Adrien', area: 'cirque gauche' },
  { id: '3', lane: '1', grade: '5c', color: 'black', setter: 'Sylvain', area: 'cirque gauche' },
  { id: '4', lane: '1', grade: '6b', color: 'yellow', setter: 'Valentin', area: 'cirque gauche' },
  { id: '5', lane: '2', grade: '5a', color: 'purple', setter: 'Karla', area: 'cirque gauche' },
  { id: '6', lane: '2', grade: '5c+', color: 'green', setter: 'Basile', area: 'cirque gauche' },
  { id: '7', lane: '2', grade: '6a', color: 'grey', setter: 'Valentin', area: 'cirque gauche' },
  {
    id: '8',
    lane: '2',
    grade: '6a+',
    color: 'white',
    setter: 'Pierre-Arnaud',
    area: 'cirque gauche',
  },
] as Route[]

export const croixNivert: Wall = {
  id: 'croixniv',
  name: 'Croix Nivert',
  city: 'Paris XVe',
  areas: [bloc, cirqueGCN, proueCN, cirqueDCN, dalle, vertD],
  routes: routesCN,
}

export const walls = [laPlaine, croixNivert]
