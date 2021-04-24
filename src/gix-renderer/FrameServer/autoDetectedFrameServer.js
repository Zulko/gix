import GifFrameServer from './GifFrameServer';
import ImageServer from './ImageServer';
import VideoFrameServer from './VideoFrameServer';

function urlToSubtype(url) {
  const extension = url.split('.').pop();
  return {
    mp4: 'video',
    webv: 'video',
    webp: 'image',
    png: 'image',
    jpeg: 'image',
    jpg: 'image',
    gif: 'gif',
  }[extension];
}

function mimetypeToSubtype(mimetype) {
  const lowerCaseMimetype = mimetype.toLowerCase();
  if (lowerCaseMimetype.indexOf('gif') > -1) {
    return 'gif';
  }
  if (lowerCaseMimetype.indexOf('image') > -1) {
    return 'image';
  }
  return 'video';
}

function autoDetectedFrameServer(url) {
  let subtype;
  if (url.startsWith('data:')) {
    const mimetype = url.substring(5, url.indexOf(';'));
    subtype = mimetypeToSubtype(mimetype);
  } else {
    subtype = urlToSubtype(url);
  }
  const FrameServerClass = {
    gif: GifFrameServer,
    video: VideoFrameServer,
    image: ImageServer,
  }[subtype];
  return new FrameServerClass(url);
}

async function initiateMissingFrameServers(gix, frameServers, loadingCallback) {
  const assetElementsWithoutFrameServer = gix.elements.filter((e) => ((
    (e.type === 'asset') && !(frameServers[e.id] && (frameServers[e.id].url
      === e.url)))));
  const nAssets = assetElementsWithoutFrameServer.length;
  const newFrameServers = { ...frameServers };
  if (nAssets > 0) {
    await Promise.all(assetElementsWithoutFrameServer.map(async (element, i) => {
      if (loadingCallback) {
        loadingCallback({
          nAssets,
          loaded: i,
        });
      }
      const frameServer = autoDetectedFrameServer(element.url);
      await frameServer.init();
      newFrameServers[element.id] = frameServer;
    }));
  }
  return newFrameServers;
}

export {
  urlToSubtype,
  autoDetectedFrameServer,
  initiateMissingFrameServers,
};
