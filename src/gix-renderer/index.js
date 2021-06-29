/* TODO:
- progress should have frameRendering and gifRendering and media loaded and fonts loaded
- UI has steps fonts loaded / https: //buefy.org/documentation/steps
*/
import GIF from 'gif.js';
import Canvg from 'canvg';
import gifWorker from 'url-loader!./gif.worker.txt'; // eslint-disable-line
import resolveTime from './resolveTime';
import { initiateMissingFrameServers } from './FrameServer/autoDetectedFrameServer';

function innerPosition(element) {
  return {
    x: {
      left: 0,
      center: -element.size.width / 2,
      right: -element.size.width,
    }[element.xAlign],
    y: {
      top: 0,
      center: -element.size.height / 2,
      bottom: -element.size.height,
    }[element.yAlign],
  };
}

const svgConverters = {
  async asset(element, params) {
    const assetDuration = element.timeCrop.end - element.timeCrop.start;
    const assetTime =
      element.speedFactor * (params.time - element.timeSegment.start);
    const adjustedAssetTime =
      element.timeCrop.start +
      (element.endBehavior === 'freeze'
        ? Math.min(assetTime, assetDuration)
        : assetTime % assetDuration);
    const frameServer = await params.frameServers[element.url];
    const frameParams = {
      size: element.size,
      crop: element.crop,
      t: adjustedAssetTime,
    };
    const imageSrc = await frameServer.getFrame(frameParams);
    const position = innerPosition(element);
    return `<image
      href = "${imageSrc}"
      x="${position.x}"
      y="${position.y}"
      height="${`${element.size.height}`}"
      width="${`${element.size.width}`}"
      opacity="${element.opacity || 1}"
    />`;
  },
  async rectangle(element) {
    const position = innerPosition(element);
    const style = `
      fill: ${element.color.toLowerCase()};
      stroke-linejoin: round;
      stroke: ${element.stroke.color};
      stroke-width: ${element.stroke.width}px;
      opacity: ${element.opacity || 1};
    `;
    return `<rect
      x="${position.x}"
      y="${position.y}"
      height="${element.size.height}"
      width="${element.size.width}"
      rx="${element.roundedCorners.rx}"
      ry="${element.roundedCorners.ry}"
      style="${style}"
    />`;
  },
  async text(element) {
    const textAnchor = {
      left: 'start',
      center: 'middle',
      right: 'end',
    }[element.xAlign];
    const dominantBaseline = {
      top: 'text-after-edge',
      center: 'center',
      bottom: 'text-before-edge',
    }[element.yAlign];
    const textLines = element.text.split('\n');
    const baseStyle = `
      font-family: ${element.font.family}, Arial;
      font-size: ${element.fontSize}px;
      font-weight: ${element.font.bold ? 'bold' : 'normal'};
      fill: ${element.color.toLowerCase()};
      text-anchor: ${textAnchor};
      dominant-baseline: ${dominantBaseline};
      stroke-linejoin: round;
      opacity: ${element.opacity || 1};
    `;
    const textStyle = `${baseStyle}
      stroke: ${element.stroke.color};
      stroke-width: ${element.stroke.width}px;
    `;
    const outlineStyle = `${baseStyle}
      stroke: ${element.outline.color};
      stroke-width: ${2 * element.outline.width}px;
    `;
    const nLines = textLines.length;
    const offset = {
      top: 0,
      center: nLines / 2.0,
      bottom: nLines,
    }[element.yAlign];
    const yTranslation = -offset * element.font.lineHeight * element.fontSize;
    const transform = `translate(0, ${yTranslation})`;
    const textLinesSVG = ''.concat(
      ...textLines.map(
        (line) =>
          `<tspan x="0" dy="${`${element.font.lineHeight}em`}">${line}</tspan>`,
      ),
    );
    let result = `
    <text
       style="${textStyle}"
       transform="${transform}"
    >
      ${textLinesSVG}
    </text>`;
    if (element.outline.width) {
      const outline = `
      <text
        style="${outlineStyle}"
        transform="${transform}"
      >
        ${textLinesSVG}
      </text>`;
      result = outline.concat(result);
    }
    return result;
  },
};

function resolveElement(element, params) {
  const { start, end } = element.timeSegment;

  return {
    ...resolveTime.resolveTimeVaryingAttributes(element, params.time),
    show: params.time >= start && params.time <= end,
  };
}

async function resolvedElementToSvg(element, params) {
  const inner = await svgConverters[element.type](element, params);
  const translation = `translate(${element.position.x}, ${element.position.y})`;
  const rotation = `rotate(${element.rotation || 0})`;
  const mirror = element.mirror ? 'scale(-1, 1)' : '';
  const elementTransform = `${translation} ${rotation} ${mirror}`;
  return `<g key='a' transform="${elementTransform}">${inner}</g>`;
}

async function renderGixFrameSvg(gix, params) {
  const innerSvgElements = await Promise.all(
    gix.elements
      .map((e) => resolveElement(e, params))
      .filter((e) => e.show)
      .map(async (e) => resolvedElementToSvg(e, params)),
  );
  const svgElements = ''.concat(innerSvgElements);
  let background = '';
  if (gix.canvas.backgroundColor !== '#000000') {
    background = `
      <rect
        width="${gix.canvas.width}"
        height="${gix.canvas.height}"
        style="fill:${gix.canvas.backgroundColor}"
      />
    `;
  }

  return `<svg
    viewBox="0 0 ${gix.canvas.width} ${gix.canvas.height}"
    xmlns="http://www.w3.org/2000/svg"
    style="width: ${`${gix.canvas.width * (params.scale || 1)}px`};
           height: ${`${gix.canvas.height * (params.scale || 1)}px`};"
  >${background}${svgElements}</svg>`;
}

async function renderGixToGif(gix, params, progressCallback) {
  const resolvedFrameServers = await initiateMissingFrameServers(
    gix,
    params.frameServers || {},
  );
  const resolvedParams = {
    ...params,
    frameServers: resolvedFrameServers,
  };
  const fps = params.fps || gix.fps;
  const gif = new GIF({
    workers: 4,
    workerScript: gifWorker,
    quality: params.gifQuality || 1,
    width: Math.round(gix.canvas.width * params.scale),
    height: Math.round(gix.canvas.height * params.scale),
    dither: params.dithering === 'None' ? null : params.dithering,
    fps,
  });
  gif.on('progress', (progress) => {
    progressCallback({ gif: progress });
  });
  const canvas = document.createElement('canvas'); // create a canvas element
  canvas.width = gix.canvas.width;
  canvas.height = gix.canvas.height;
  const canvasCtx = canvas.getContext('2d');
  const timeBetweenFrames = 1.0 / fps;
  const duration = gix.duration / (params.speedFactor || 1);
  const numberOfFrames = Math.floor(duration / timeBetweenFrames);
  const frameTimes = [...Array(numberOfFrames).keys()].map(
    (e) => timeBetweenFrames * e * (params.speedFactor || 1),
  );
  /* eslint-disable  */
  for (const [i, time] of frameTimes.entries()) {
    //eslint-disable-line
    const frameSvg = await renderGixFrameSvg(gix, {
      //eslint-disable-line
      ...resolvedParams,
      time,
    });
    canvasCtx.fillStyle = gix.canvas.backgroundColor;
    canvasCtx.fillRect(0, 0, gix.canvas.width, gix.canvas.height);
    const svg = await Canvg.fromString(canvasCtx, frameSvg); //eslint-disable-line
    await svg.render(); //eslint-disable-line
    // await svg.ready(); //eslint-disable-line

    gif.addFrame(canvasCtx, {
      copy: true,
      delay: Math.floor(1000 * timeBetweenFrames),
    });
    if (progressCallback) {
      progressCallback({
        numberOfFrames,
        currentFrame: i,
      });
    }
  }
  /* eslint-enable  */
  const result = await new Promise((resolve, reject) => {
    gif.on('finished', (blob) => {
      const reader = new window.FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        resolve(reader.result);
      };
    });
    try {
      gif.render();
    } catch (e) {
      reject(e);
    }
  });
  return result;
}

export { resolveElement, resolvedElementToSvg, renderGixToGif, svgConverters }; // eslint-disable-line
