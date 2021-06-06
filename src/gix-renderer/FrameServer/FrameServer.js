class FrameServer {
  projectSourceOnCanvas(source, params) {
    const { size, crop } = params;
    this.projectionCanvas.width = size.width;
    this.projectionCanvas.height = size.height;
    this.projectionCanvasCtx.drawImage(
      source,
      crop.left,
      crop.top,
      source.width - crop.right - crop.left,
      source.height - crop.top - crop.bottom,
      0,
      0,
      size.width,
      size.height,
    );
  }

  getFrame(t, params) {
    if (t < this.sourceStats.duration) {
      return this.getFrameAtTime(t, params);
    }
    if (params.endBehaviour === 'loop') {
      return this.getFrame(t % this.sourceStats.duration);
    }
    if (params.endBehaviour === 'freeze') {
      return this.frameData[this.frameData.length - 1].imageDataUrl;
    }
    return null;
  }
}

export default FrameServer;
