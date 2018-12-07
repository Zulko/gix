export const getters = {
  getElement: (state) => (elementId) => {
    return state.project.elements.filter(c => c.id === elementId)[0]
  },
  getElementIndex: (state) => (elementId) => {
    return state.project.elements.map(c => c.id).indexOf(elementId)
  }
}
