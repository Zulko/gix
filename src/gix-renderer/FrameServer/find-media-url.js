import getYoutubeId from 'get-youtube-id';
import axios from 'axios';
import { generateYoutubeResponse } from './url-fetcher';

async function lambdaRequest(requestData) {
  const response = axios({
    url:
      'https://6ul0vlrhze.execute-api.us-east-2.amazonaws.com/default/url-fetcher',
    data: JSON.stringify(requestData),
    method: 'POST',
  });
  return response.data;
}

function selectYoutubeMediaUrl(mp4Formats) {
  const mp4FormatsUnder1200 = mp4Formats.filter((f) => f.width < 1200);
  const maxWidth = Math.max(...mp4FormatsUnder1200.map((f) => f.width));
  const selectedFormat = mp4Formats.filter((f) => f.width === maxWidth)[0];
  return selectedFormat.url;
}

async function findYoutubeMediaUrl(youtubeId) {
  let response;
  try {
    response = await generateYoutubeResponse(youtubeId);
  } catch {
    response = await lambdaRequest({ youtubeId });
  }
  const { title, mp4Formats } = response;
  return {
    title,
    url: selectYoutubeMediaUrl(mp4Formats),
  };
}

async function findMediaUrl(url) {
  const youtubeId = getYoutubeId(url);
  if (youtubeId) {
    return findYoutubeMediaUrl(youtubeId);
  }
  return null;
}

export default { findMediaUrl };
