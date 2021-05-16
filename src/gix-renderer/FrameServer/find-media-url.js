import getYoutubeId from 'get-youtube-id';
import { getYoutubeVideoInfo } from './url-fetcher';

function selectYoutubeMediaUrl(mp4Formats) {
  const mp4FormatsUnder1200 = mp4Formats.filter((f) => f.width < 1200);
  const maxWidth = Math.max(...mp4FormatsUnder1200.map((f) => f.width));
  const selectedFormat = mp4Formats.filter((f) => f.width === maxWidth)[0];
  return selectedFormat.url;
}

async function findYoutubeMediaUrl(youtubeId) {
  const response = await getYoutubeVideoInfo(youtubeId);
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
