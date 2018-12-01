export const getters = {
  getCaption: (state) => (captionId) => {
    return state.project.captions.filter(c => c.id === captionId)[0]
  },
  getCaptionIndex: (state) => (captionId) => {
    return state.project.captions.map(c => c.id).indexOf(captionId)
  }
}
