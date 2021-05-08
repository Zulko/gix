import videoUrlLink from 'video-url-link';
// import MediaUrlWorker from './media-url.worker.js'; //eslint-disable-line
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

async function getMediaUrl(parameters) {
  const worker = new Worker('/gix/media-url2.worker.js');
  return new Promise((resolve, reject) => {
    worker.onmessage = (m) => {
      console.log('Received', m);
      resolve(m);
    };
    worker.onerror = (e) => {
      reject(e);
    };
    worker.postMessage(parameters);
  });
}

async function autoDetectedFrameServer(url) {
  let subtype;
  if (url.includes('youtu.be')) {
    const message = await getMediaUrl({ youtube: url });
    const resolvedUrl = message.data;
    console.log('SUCCESS!!!!', resolvedUrl);
    return new VideoFrameServer(url, resolvedUrl);
    // return new Promise((resolve, reject) => {
    //   videoUrlLink.youtube.getInfo(url, { hl: 'en' }, (error, infos) => {
    //     if (error) {
    //       reject(error);
    //     } else {
    //       resolvedUrl = infos.formats[6].url;
    //       resolve(new VideoFrameServer(url, resolvedUrl));
    //     }
    //   });
    // });
  }
  if (url.includes('twitter.com')) {
    return new Promise((resolve, reject) => {
      videoUrlLink.twitter.getInfo(url, { hl: 'en' }, (error, infos) => {
        if (error) {
          reject(error);
        } else {
          const resolvedUrl = infos.formats[6].url;
          resolve(new VideoFrameServer(url, resolvedUrl));
        }
      });
    });
  }
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
  const assetElementsWithoutFrameServer = gix.elements.filter(
    (e) =>
      e.type === 'asset' &&
      !(frameServers[e.id] && frameServers[e.id].url === e.url),
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
        const frameServer = await autoDetectedFrameServer(element.url);
        await frameServer.init();
        newFrameServers[element.id] = frameServer;
      }),
    );
  }
  return newFrameServers;
}

export { urlToSubtype, autoDetectedFrameServer, initiateMissingFrameServers };
