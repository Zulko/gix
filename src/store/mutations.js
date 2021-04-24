import lodash from 'lodash';
import { defaultElements, defaultStartingProject } from './data/default_elements';

/*eslint-disable */
function generateRandomID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
/* eslint-enable */

function elementAndIndex(elementId, state) {
  const index = state.project.elements.map(c => c.id).indexOf(elementId);
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
  newEmptyProject(state) {
    state.project = deepcopy(defaultElements.project);
  },
  updateElement(state, { elementId, update }) {
    const [element, index] = elementAndIndex(elementId, state);
    const newElements = state.project.elements.slice();
    const newElement = deepcopy(element);
    lodash.merge(newElement, update);
    newElements[index] = newElement;
    state.project.elements = newElements;
    // state.project.elements[index] = newElement
  },
  updateGlobals(state, update) {
    const newGlobals = deepcopy(state.globals);
    lodash.merge(newGlobals, update);
    state.globals = newGlobals;
  },
  addElement(state, elementType) {
    const newElement = deepcopy(defaultElements[elementType]);
    newElement.timeSegment.end = state.project.duration;
    newElement.id = generateRandomID();
    state.project = {
      ...state.project,
      elements: [...state.project.elements, newElement]
    };
  },
  duplicateElement(state, elementId) {
    const newElements = state.project.elements.slice();
    const [element, index] = elementAndIndex(elementId, state);
    const newElement = deepcopy(element);
    newElement.id = generateRandomID();
    newElements.splice(index + 1, 0, newElement);
    state.project = {
      ...state.project,
      elements: newElements
    };
  },
  deleteElement(state, elementId) {
    const newElements = state.project.elements.slice();
    const index = elementAndIndex(elementId, state)[1];
    newElements.splice(index, 1);
    state.project.elements = newElements;
  },
  moveElementUp(state, elementId) {
    const [element, index] = elementAndIndex(elementId, state);
    const indexUp = Math.max(0, index - 1);
    const newElements = state.project.elements.slice();
    newElements[index] = state.project.elements[indexUp];
    newElements[indexUp] = element;
    state.project = {
      ...state.project,
      elements: newElements
    };
  },
  moveElementDown(state, elementId) {
    const [element, index] = elementAndIndex(elementId, state);
    const indexDown = Math.min(state.project.elements.length - 1, index + 1);
    const newElements = state.project.elements.slice();
    newElements[index] = state.project.elements[indexDown];
    newElements[indexDown] = element;
    state.project = {
      ...state.project,
      elements: newElements
    };
  },
  setDefaultStartingProject(state) {
    state.project = {
      ...defaultStartingProject
    };
  },
  setProject(state, newProject) {
    state.project = newProject;
  }
};
