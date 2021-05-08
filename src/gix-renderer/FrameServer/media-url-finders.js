async function callWorker({ workerUrl, parameters }) {
  const worker = new Worker(workerUrl);
  return new Promise((resolve, reject) => {
    worker.onmessage = resolve;
    worker.onerror = reject;
    worker.postMessage(parameters);
  });
}

function getyoutubeUrl({ youtubeId, workerScript }) {}
