import GifFrameServer from './GifFrameServer';
import ImageServer from './ImageServer';
import VideoFrameServer from './VideoFrameServer';

// async function findMimeType(url) {
//   return new Promise((resolve) => {
//     const xhttp = new XMLHttpRequest();
//     xhttp.open('HEAD', url);
//     xhttp.onreadystatechange = () => {
//       resolve(xhttp.getResponseHeader('Content-Type'));
//     };
//     xhttp.send();
//   });
// }

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

async function autoDetectedFrameServer(urlData) {
  let subtype;
  const mediaUrl = urlData.mediaUrl || urlData.url;
  if (mediaUrl.includes('googlevideo')) {
    subtype = 'video';
  } else if (mediaUrl.startsWith('data:')) {
    const mimetype = mediaUrl.substring(5, mediaUrl.indexOf(';'));
    subtype = mimetypeToSubtype(mimetype);
  } else {
    subtype = urlToSubtype(mediaUrl);
  }
  const FrameServerClass = {
    gif: GifFrameServer,
    video: VideoFrameServer,
    image: ImageServer,
  }[subtype];
  return new FrameServerClass(urlData.url, mediaUrl);
}

function findAssetElementsWithoutFrameServer(gix, frameServers) {
  return gix.elements.filter((e) => e.type === 'asset' && !frameServers[e.url]);
}

async function getFrameServer(element) {
  const frameServer = await autoDetectedFrameServer(element);
  await frameServer.init();
  return frameServer;
}
async function initiateMissingFrameServers(gix, frameServers, loadingCallback) {
  const assetElementsWithoutFrameServer = findAssetElementsWithoutFrameServer(
    gix,
    frameServers,
  );
  const nAssets = assetElementsWithoutFrameServer.length;
  const newFrameServers = { ...frameServers };
  if (nAssets > 0) {
    await Promise.all(
      assetElementsWithoutFrameServer.map(async (element, i) => {
        if (loadingCallback) {
          loadingCallback({
            nAssets,
            loaded: i,
          });
        }
        const frameServer = await autoDetectedFrameServer(element);
        await frameServer.init();
        newFrameServers[element.url] = frameServer;
      }),
    );
  }
  return newFrameServers;
}

export {
  urlToSubtype,
  autoDetectedFrameServer,
  initiateMissingFrameServers,
  findAssetElementsWithoutFrameServer,
  getFrameServer,
};
