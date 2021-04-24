import defaultStartingProject from './defaultStartingProject.json';

const defaultElementBase = {
  id: '0',
  editorSettings: {
    isMainElement: false,
    isDefaultFocus: false,
    isDraggable: true,
  },
  timeSegment: {
    start: 0,
    end: 2,
    alwaysShow: true,
  },
  position: {
    x: 0,
    y: 0,
    scale: 1.0,
    rotation: 0,
    isMoving: false,
    xAlign: 'center',
    yAlign: 'center',
  },
  stroke: {
    width: 1,
    color: 'rgba(0, 0, 0, 1)',
  },
};

const defaultElements = {
  project: {
    infos: {
      gixVersion: '0.1.0',
      title: 'Unnamed Project',
      author: 'Anonymous giffer',
      tags: [],
    },
    canvas: {
      width: 300,
      height: 125,
      aspectRatio: 2.4,
      backgroundColor: '#000000',
    },
    duration: 4,
    fps: 15,
    elements: [],
    extends: null,
  },
  text: {
    ...defaultElementBase,
    type: 'text',
    text: 'Hey!',
    font: {
      family: 'Anton',
      bold: false,
      size: 40,
      lineHeight: 1.0,
    },
    color: '#EEEE20',
    outline: {
      width: 0,
      color: '#000000',
    },
    position: {
      x: 50,
      y: 50,
      rotate: 1,
      xAlign: 'center',
      yAlign: 'center',
    },
  },
  asset: {
    ...defaultElementBase,
    type: 'asset',
    subtype: 'gif',
    url: 'https://help.imgur.com/hc/en-us/article_attachments/115000241146/mindblown.gif',
    stroke: {
      width: 1,
      color: '#000000',
    },
    size: {
      width: 300,
      height: 125,
      aspectRatio: 2.4,
      preserveOriginalRatio: true,
    },
    crop: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
    timeCrop: {
      start: 0,
      end: 10,
    },
    speedFactor: 1.0,
  },
  shape: {
    ...defaultElementBase,
    type: 'shape',
    subtype: 'rectangle',
    rectangleProps: {
      width: 100,
      height: 40,
    },
    outline: {
      width: 0,
      color: '#000000)',
    },
    circleProps: {
      r: 0,
    },
    path: [],
  },
  group: {
    ...defaultElementBase,
    type: 'groups',
    elements: [],
  },
};

export {
  defaultStartingProject,
  defaultElements,
};
