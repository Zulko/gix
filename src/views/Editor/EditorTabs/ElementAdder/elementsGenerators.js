import { autoDetectedFrameServer } from '../../../../gix-renderer/FrameServer/autoDetectedFrameServer';

function defaultElementBase(project, position = {}) {
  return {
    editorSettings: {
      isMainElement: false,
      isDraggable: true,
    },
    timeSegment: {
      start: 0,
      end: project.duration,
    },
    position: {
      x: position.x || project.canvas.width / 2,
      y: position.y || project.canvas.height / 2,
    },
    scale: 1,
    rotation: 0,
    xAlign: 'center',
    yAlign: 'center',
    stroke: {
      widthPercent: 0,
      color: 'rgba(0, 0, 0, 1)',
    },
    opacity: 1,
  };
}

function newText(project, position = {}) {
  return {
    ...defaultElementBase(project, position),
    type: 'text',
    text: 'Hey!',
    font: {
      family: 'Anton',
      bold: false,
      lineHeight: 1.0,
    },
    fontSize: 40,
    color: '#EEEE20',
    outline: {
      widthPercent: 5,
      color: '#000000',
    },
  };
}

function newRectangle(project, position = {}) {
  return {
    ...defaultElementBase(project, position),
    type: 'rectangle',
    subtype: 'rectangle',
    color: '#FFFFFF',
    size: {
      width: Math.min(0.6 * project.canvas.width, 800),
      height: Math.min(0.6 * project.canvas.height, 600),
      aspectRatio: 2.4,
      preserveOriginalRatio: true,
    },
    stroke: {
      widthPercent: 1,
      color: '#000000',
    },
    roundedCorners: {
      rx: 0,
      ry: 0,
    },
  };
}

async function newAsset(urlData, project, position = {}) {
  const server = await autoDetectedFrameServer(urlData, position);
  const sourceStats = await server.getInfos();
  return {
    ...defaultElementBase(project),
    ...urlData,
    stroke: {
      widthPercent: 0,
      color: '#000000',
    },
    type: 'asset',
    subtype: server.type,
    size: {
      width: sourceStats.width,
      height: sourceStats.height,
      aspectRatio: sourceStats.width / sourceStats.height,
    },
    crop: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
    timeCrop: {
      start: 0,
      end: sourceStats.duration,
    },
    speedFactor: 1.0,
  };
}

export default {
  newText,
  newRectangle,
  newAsset,
};
