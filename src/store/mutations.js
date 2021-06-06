import lodash from 'lodash';

function generateID(elements, offset = 0) {
  const suggestedId = `element-${offset}`;
  if (elements.some((e) => e.id === suggestedId)) {
    return generateID(elements, offset + 1);
  }
  return suggestedId;
}
/* eslint-enable */

function elementAndIndex(elementId, state) {
  const index = state.project.elements.map((c) => c.id).indexOf(elementId);
  return [state.project.elements[index], index];
}

function deepcopy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export default {
  updateEditorPlayerTime(state, update) {
    state.editorPlayerTime = update;
  },
  updateAssetStats(state, update) {
    state.assetStats = update;
  },
  updateProject(state, update) {
    const newProject = deepcopy(state.project);
    lodash.merge(newProject, update);
    state.project = newProject;
  },
  updateElement(state, { elementId, update }) {
    const [element, index] = elementAndIndex(elementId, state);
    const newElements = state.project.elements.slice();
    const newElement = deepcopy(element);
    lodash.merge(newElement, update);
    newElements[index] = newElement;
    state.project.elements = newElements;
  },
  updateGlobals(state, update) {
    const newGlobals = deepcopy(state.globals);
    lodash.merge(newGlobals, update);
    state.globals = newGlobals;
  },
  addElement(state, element) {
    const newElement = { ...element, id: generateID(state.project.elements) };
    state.project = {
      ...state.project,
      elements: [...state.project.elements, newElement],
    };
    state.globals.activeEditorElementTab = state.project.elements.length - 1;
  },
  duplicateElement(state, elementId) {
    const newElements = state.project.elements.slice();
    const [element, index] = elementAndIndex(elementId, state);
    const newElement = deepcopy(element);
    newElement.editorSettings = {
      isMainElement: false,
      isDefaultFocus: false,
      isDraggable: true,
    };
    newElement.id = generateID(state.project.elements);
    newElements.splice(index + 1, 0, newElement);
    state.project = {
      ...state.project,
      elements: newElements,
    };
    state.globals.activeEditorElementTab = index + 1;
  },
  deleteElement(state, elementId) {
    const newElements = state.project.elements.slice();
    const index = elementAndIndex(elementId, state)[1];
    newElements.splice(index, 1);
    state.project.elements = newElements;
    state.globals.activeEditorElementTab = index - 1;
  },
  moveElementDown(state, elementId) {
    const [element, index] = elementAndIndex(elementId, state);
    const indexUp = Math.max(0, index - 1);
    const newElements = state.project.elements.slice();
    newElements[index] = state.project.elements[indexUp];
    newElements[indexUp] = element;
    state.project.elements = newElements;
    state.globals.activeEditorElementTab = index - 1;
  },
  moveElementUp(state, elementId) {
    const [element, index] = elementAndIndex(elementId, state);
    const indexDown = Math.min(state.project.elements.length - 1, index + 1);
    const newElements = state.project.elements.slice();
    newElements[index] = state.project.elements[indexDown];
    newElements[indexDown] = element;
    state.project.elements = newElements;
    state.globals.activeEditorElementTab = index + 1;
  },
  setProject(state, newProject) {
    state.project = newProject;
  },
  setProjectFromCopy(state, newProject) {
    state.project = deepcopy(newProject);
  },
  saveProject(state, newProject) {
    state.savedProjects[newProject.infos.title] = deepcopy(newProject);
  },
  setFreezeGifPreview(state, val) {
    state.freezeGifPreview = val;
  },
  emptyProject(state) {
    state.project = {};
  },
  setEditorTabIndex(state, val) {
    state.globals.activeEditorElementTab = val;
  },
  setEditorTabIndexToElementId(state, elementId) {
    const index = state.project.elements.map((c) => c.id).indexOf(elementId);
    state.globals.activeEditorElementTab = index;
  },
};
