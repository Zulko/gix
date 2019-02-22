var defaultElementBase = {
  id: '0',
  isMaster: false,
  timeSegment: {
    start: 0,
    end: 2,
    alwaysShow: true
  },
  position: {
    x: 0,
    y: 0,
    scale: 1.0,
    rotation: 0
  },
  alignment: {
    x: 'center',
    y: 'center'
  },
  stroke: {
    width: 1,
    color: 'rgba(0, 0, 0, 1)'
  },
  cssAnimation: {
    in: {
      class: 'none',
      speed: 'normal-speed'
    },
    out: {
      class: 'none',
      speed: 'normal-speed'
    },
    loop: {
      class: 'none',
      speed: 'normal-speed'
    }
  }
}

export const defaultElements = {
  project: {
    infos: {
      gixVersion: '0.1.0',
      title: 'Unnamed Project',
      author: 'Anonymous giffer'
    },
    canvas: {
      width: 300,
      height: 200,
      bgColor: '#000000'
    },
    duration: 4,
    gifOptions: {
      fps: 15,
      quality: 10
    },
    elements: [],
    extends: null
  },
  text: Object.assign({}, defaultElementBase, {
    type: 'text',
    text: 'Hey!',
    font: {
      family: 'Impact',
      bold: false,
      size: 40
    },
    color: 'rgba(235, 247, 8, 1)',
    position: {
      x: 50,
      y: 50
    }
  }),
  asset: Object.assign({}, defaultElementBase, {
    type: 'asset',
    subtype: 'gif',
    url: 'https://help.imgur.com/hc/en-us/article_attachments/115000241146/mindblown.gif',
    stroke: {
      width: 1,
      color: 'rgba(0, 0, 0, 1)'
    },
    size: {
      width: 500,
      height: 300,
      preserveOriginalRatio: true
    }
  }),
  shape: Object.assign({}, defaultElementBase, {
    type: 'shape',
    subtype: 'rectangle',
    rectangleProps: {
      width: 100,
      height: 40
    },
    circleProps: {
      r: 0
    },
    path: []
  }),
  group: Object.assign({}, defaultElementBase, {
    type: 'groups',
    elements: []
  })
}
