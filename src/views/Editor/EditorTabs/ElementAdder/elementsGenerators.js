import { autoDetectedFrameServer } from '../../../../gix-renderer/FrameServer/autoDetectedFrameServer';

function defaultElementBase(project, position = {}) {
  console.log(project.canvas.width, position);
  return {
    editorSettings: {
      isMainElement: false,
      isDefaultFocus: false,
      isDraggable: true,
    },
    timeSegment: {
      start: 0,
      end: project.duration,
    },
    position: {
      x: position.x || project.canvas.width / 2,
      y: position.y || project.canvas.height / 2,
      scale: 1,
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
}

function newText(project, position = {}) {
  return {
    ...defaultElementBase(project, position),
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
      width: 2,
      color: '#000000',
    },
    roundedCorners: {
      rx: 0,
      ry: 0,
    },
  };
}

async function newAsset(urlData, project, position = {}) {
  console.log(urlData);
  const server = await autoDetectedFrameServer(urlData, position);
  const sourceStats = await server.getInfos();
  return {
    ...defaultElementBase(project),
    ...urlData,
    stroke: {
      width: 1,
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
