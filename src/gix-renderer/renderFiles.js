import GIF from 'gif.js';
import Canvg from 'canvg';
import gifWorker from 'url-loader!./gif.worker.txt'; // eslint-disable-line
import { renderGixFrameSvg } from '.';
import {
  initiateMissingFrameServers,
  findAssetUrlsWithoutFrameServer,
} from './FrameServer/autoDetectedFrameServer';

const getHME = () => import(/* webpackChunkName: "HME" */ 'h264-mp4-encoder');

async function renderGixToGif(gix, params, progressCallback) {
  const missingUrlDataList = findAssetUrlsWithoutFrameServer(
    gix,
    params.frameServers || {},
  );
  const missingFrameServers = await initiateMissingFrameServers(
    missingUrlDataList,
  );
  const resolvedParams = {
    ...params,
    frameServers: { ...(params.frameServers || {}), ...missingFrameServers },
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
      finalWidth: gix.canvas.width * (resolvedParams.scale || 1),
      finalHeight: gix.canvas.height * (resolvedParams.scale || 1),
      time,
    });
    canvasCtx.fillStyle = gix.canvas.backgroundColor;
    canvasCtx.fillRect(0, 0, gix.canvas.width, gix.canvas.height);
    const svg = await Canvg.fromString(canvasCtx, frameSvg); //eslint-disable-line
    await svg.render(); //eslint-disable-line

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

async function renderGixToMp4(gix, params, progressCallback) {
  const missingUrlDataList = findAssetUrlsWithoutFrameServer(
    gix,
    params.frameServers || {},
  );
  const missingFrameServers = await initiateMissingFrameServers(
    missingUrlDataList,
  );
  const resolvedParams = {
    ...params,
    frameServers: { ...(params.frameServers || {}), ...missingFrameServers },
  };
  function roundToEven(value) {
    return value + (value % 2);
  }
  const finalWidth = roundToEven(params.scale * gix.canvas.width);
  const finalHeight = roundToEven(params.scale * gix.canvas.height);
  const fps = params.fps || gix.fps;
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
  const HME = await getHME();
  const encoder = await HME.createH264MP4Encoder();

  encoder.width = roundToEven(params.scale * canvas.width);
  encoder.height = roundToEven(params.scale * canvas.height);
  encoder.frameRate = fps;
  encoder.speed = 10;
  encoder.initialize();
  /* eslint-disable  */
  for (const [i, time] of frameTimes.entries()) {
    //eslint-disable-line
    const frameSvg = await renderGixFrameSvg(gix, {
      //eslint-disable-line
      ...resolvedParams,
      time,
      finalWidth,
      finalHeight,
    });
    canvasCtx.fillStyle = gix.canvas.backgroundColor;
    canvasCtx.fillRect(0, 0, gix.canvas.width, gix.canvas.height);
    const svg = await Canvg.fromString(canvasCtx, frameSvg); //eslint-disable-line

    await svg.render();
    encoder.addFrameRgba(
      canvasCtx.getImageData(0, 0, canvas.width, canvas.height).data,
    );
    if (progressCallback) {
      progressCallback({
        numberOfFrames,
        currentFrame: i,
      });
    }
  }
  encoder.finalize();
  const uint8Array = encoder.FS.readFile(encoder.outputFilename);
  const blob = new Blob([uint8Array], { type: 'video/mp4' });

  const result = await new Promise((resolve, reject) => {
    const reader = new window.FileReader();
    reader.readAsDataURL(blob);
    try {
      reader.onloadend = () => {
        resolve(reader.result);
      };
    } catch (error) {
      reject(error);
    }
  });
  encoder.delete();
  return result;
}

export { renderGixToGif, renderGixToMp4 }; // eslint-disable-line
