/**
 * Demonstrates a simple HTTP endpoint using API Gateway. You have full
 * access to the request and response payload, including headers and
 * status code.
 */
const https = require('https');

function uriToJson(params) {
  return params
    .split('&')
    .map((i) => i.split('='))
    .reduce((m, o) => {
      const [first, second] = o;
      m[first] = second; // eslint-disable-line no-param-reassign
      return m;
    }, {});
}

async function httpRequest(options) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve(data);
      });
    });
    req.on('error', (error) => {
      reject(error);
    });
    req.end();
  });
}

async function getYoutubeStreamingData(youtubeId) {
  const jsonResponse = await new Promise((resolve, reject) => {
    fetch(`https://www.youtube.com/watch?v=${youtubeId}&pbj=1`, {
      method: 'POST',
      credentials: 'omit',
    })
      .then(
        (_response) => _response.json(),
        (error) => reject(error),
      )
      .then((json) => {
        console.log({ json });
        resolve(json);
      });
  });
  const videoParams = jsonResponse.reduce((a, x) => ({ ...a, ...x }), {});
  return videoParams.playerResponse.streamingData;
}

console.log(getYoutubeStreamingData);

async function getYoutubeVideoInfo(youtubeId) {
  const response = await new Promise((resolve, reject) => {
    fetch(`https://www.youtube.com/get_video_info?video_id=${youtubeId}`, {
      method: 'GET',
      credentials: 'omit',
    })
      .then(
        (_response) => _response.text(),
        (error) => reject(error),
      )
      .then((text) => {
        resolve(text);
      });
  });
  const jsonResponse = uriToJson(response);
  const playerResponse = JSON.parse(
    decodeURIComponent(jsonResponse.player_response),
  );
  const { title } = playerResponse.videoDetails;
  let { streamingData } = playerResponse;
  if (!streamingData) {
    streamingData = await getYoutubeStreamingData(youtubeId);
  }
  const isMp4 = (f) => f.mimeType.startsWith('video/mp4');
  const mp4Formats = streamingData.adaptiveFormats.filter(isMp4);
  return { title, mp4Formats };
}

async function generateTwitterResponse(youtubeId) {
  const response = await httpRequest({
    hostname: 'www.youtube.com',
    path: `/get_video_info?video_id=${youtubeId}`,
    method: 'GET',
  });
  const jsonResponse = uriToJson(response);
  const playerResponse = JSON.parse(
    decodeURIComponent(jsonResponse.player_response),
  );
  return playerResponse.streamingData.adaptiveFormats;
}

async function generateResponse(inputParams) {
  if (inputParams.youtubeId) {
    return getYoutubeVideoInfo(inputParams.youtubeId);
  }
  if (inputParams.twitterId) {
    return generateTwitterResponse(inputParams.youtubeId);
  }
  return {};
}

exports.getYoutubeVideoInfo = getYoutubeVideoInfo;

exports.handler = async (event) => {
  let body;
  let statusCode = '200';
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Origin': 'https://zulko.github.io',
  };

  try {
    switch (event.httpMethod) {
      case 'GET':
        body = 'You got me ah ah ah!';
        break;
      case 'OPTIONS':
        break;
      case 'POST':
        body = await generateResponse(JSON.parse(event.body));
        break;
      default:
        throw new Error(`Unsupported method "${event.httpMethod}"`);
    }
  } catch (err) {
    statusCode = '400';
    body = err.message;
  } finally {
    body = JSON.stringify(body);
    // console.log('BODY LENGTH: ', body.length);
  }
  return {
    statusCode,
    body,
    headers,
  };
};
