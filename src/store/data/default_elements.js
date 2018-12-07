var defaultBase = {
  'id': '0',
  'timeSegment': {
    'start': 0,
    'end': 2
  },
  'position': {
    'x': 50,
    'y': 50,
    'xAlign': 'left',
    'yAlign': 'top',
    'lineHeight': 50
  },
  'animation': {
    'in': {
      'class': 'none',
      'speed': 'normal-speed'
    },
    'out': {
      'class': 'none',
      'speed': 'normal-speed'
    },
    'loop': {
      'class': 'none',
      'speed': 'normal-speed'
    }
  }
}

export const defaultElements = {
  text: Object.assign({}, defaultBase, {
    'type': 'text',
    'text': 'Hey',
    'font': {
      'family': 'Impact',
      'bold': false,
      'color': 'rgba(235, 247, 8, 1)',
      'stroke': {
        'width': 1,
        'color': 'rgba(0, 0, 0, 1)'
      },
      'size': 40
    }
  })
}
