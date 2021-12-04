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

function objectWithNullifiedTimeVariables(obj) {
  return Object.fromEntries(
    Object.keys(obj).map((key) => {
      const data = obj[key];
      if (key === 'timeVariable') {
        return [key, null];
      }
      if (typeof data === 'object' && data !== null) {
        return [key, objectWithNullifiedTimeVariables(data)];
      }
      return [key, data];
    }),
  );
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
    // Nullify all time variables, otherwise lodash will marge rather than
    // replace them (in this project timeVariables always get straight-up
    // replaced)
    const updateWithoutTimeVariable = objectWithNullifiedTimeVariables(update);
    lodash.merge(newElement, updateWithoutTimeVariable);
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
    state.activeEditorElementTab = state.project.elements.length - 1;
  },
  duplicateElement(state, elementId) {
    const newElements = state.project.elements.slice();
    const [element, index] = elementAndIndex(elementId, state);
    const newElement = deepcopy(element);
    newElement.editorSettings = {
      isMainElement: false,
      isDraggable: true,
    };
    newElement.id = generateID(state.project.elements);
    newElements.splice(index + 1, 0, newElement);
    state.project = {
      ...state.project,
      elements: newElements,
    };
    state.activeEditorElementTab = index + 1;
  },
  deleteElement(state, elementId) {
    const newElements = state.project.elements.slice();
    const index = elementAndIndex(elementId, state)[1];
    newElements.splice(index, 1);
    state.project.elements = newElements;
    state.activeEditorElementTab = index - 1;
  },
  moveElementDown(state, elementId) {
    const [element, index] = elementAndIndex(elementId, state);
    const indexUp = Math.max(0, index - 1);
    const newElements = state.project.elements.slice();
    newElements[index] = state.project.elements[indexUp];
    newElements[indexUp] = element;
    state.project.elements = newElements;
    state.activeEditorElementTab = index - 1;
  },
  moveElementUp(state, elementId) {
    const [element, index] = elementAndIndex(elementId, state);
    const indexDown = Math.min(state.project.elements.length - 1, index + 1);
    const newElements = state.project.elements.slice();
    newElements[index] = state.project.elements[indexDown];
    newElements[indexDown] = element;
    state.project.elements = newElements;
    state.activeEditorElementTab = index + 1;
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
  unsaveProject(state, title) {
    const newSavedProjects = deepcopy(state.savedProjects);
    delete newSavedProjects[title];
    state.savedProjects = newSavedProjects;
  },
  setFreezeGifPreview(state, val) {
    state.freezeGifPreview = val;
  },
  setEditorPlayerTimeCrop(state, val) {
    state.editorPlayerTimeCrop = val;
  },
  emptyProject(state) {
    state.project = {};
  },
  setEditorTabIndex(state, val) {
    state.activeEditorElementTab = val;
  },
  setEditorTabIndexToElementId(state, elementId) {
    const index = state.project.elements.map((c) => c.id).indexOf(elementId);
    state.activeEditorElementTab = index;
  },
};
