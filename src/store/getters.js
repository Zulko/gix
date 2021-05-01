function getElement(state) {
  return (elementId) => state.project.elements.filter((c) => c.id === elementId)[0];
}

function getElementIndex(state) {
  return (elementId) => state.project.elements.map((c) => c.id).indexOf(elementId);
}

function assetStats(state) {
  return state.assetStats;
}

function tagsInSavedProjects(state) {
  const allTags = [
    ...Object.keys(state.savedProjects).map(
      (name) => state.savedProjects[name].infos.tags,
    ),
  ];
  return [...new Set(allTags)];
}
export default {
  getElement,
  getElementIndex,
  assetStats,
  tagsInSavedProjects,
};
