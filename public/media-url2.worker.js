function uriToJson(params) {
  return params
    .split('&')
    .map((i) => i.split('='))
    .reduce((m, o) => {
      m[o[0]] = o[1];
      return m;
    }, {});
}

onmessage = function onMessage(e) {
  if (e.data) {
    if (e.data.youtube) {
      fetch(
        // 'https://www.youtube.com/get_video_info?video_id=nrRcmDxMLKc&eurl=https%3A%2F%2Fyoutube.googleapis.com%2Fv%2FnrRcmDxMLKc&ps=default&gl=US&hl=en',
        // 'https://www.youtube.com/get_video_info?video_id=nrRcmDxMLKc&ps=default&gl=US&hl=en',
        'https://www.youtube.com/embed/?autoplay=1&controls=1&modestbranding=1&rel=0&showinfo=0&enablejsapi=1&iv_load_policy=3&disablekb=1&playsinline=1&origin=https%3A%2F%2Fmakeagif.com&widgetid=1',
      )
        .then((response) => response.text())
        .then((data) => {
          const json = uriToJson(data);
          const playerResponse = JSON.parse(
            decodeURIComponent(json.player_response),
          );
          // console.log(playerResponse);
          const h264Formats = playerResponse.streamingData.adaptiveFormats.filter(
            (f) => f.mimeType.startsWith('video/mp4') && f.width < 1100,
          );
          const maxWidth = Math.max(...h264Formats.map((f) => f.width));
          const selectedFormat = h264Formats.filter(
            (f) => f.width === maxWidth,
          )[0];
          postMessage(selectedFormat.url);
          postMessage(json);
        });
    } else if (e.data.twitter) {
      postMessage(e.data.twitter);
    }
  }
};
