function getElement(state) {
  return (elementId) =>
    state.project.elements.filter((c) => c.id === elementId)[0];
}

function getElementIndex(state) {
  return (elementId) =>
    state.project.elements.map((c) => c.id).indexOf(elementId);
}

function assetStats(state) {
  return state.assetStats;
}
export default {
  getElement,
  getElementIndex,
  assetStats,
};
