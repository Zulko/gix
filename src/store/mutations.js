import lodash from 'lodash'
import { generateRandomID } from '../tools'
import { defaultElements, defaultStartingProject } from './data/default_elements.js'

function elementAndIndex (elementId, state) {
  var index = state.project.elements.map(c => c.id).indexOf(elementId)
  return [state.project.elements[index], index]
}
function deepcopy (obj) {
  return JSON.parse(JSON.stringify(obj))
}

export const mutations = {
  updateProject (state, update) {
    var newProject = deepcopy(state.project)
    lodash.merge(newProject, update)
    state.project = newProject
  },
  newEmptyProject (state) {
    state.project = deepcopy(defaultElements.project)
  },
  updateElement (state, {elementId, update}) {
    var [element, index] = elementAndIndex(elementId, state)
    var newElements = state.project.elements.slice()
    var newElement = deepcopy(element)
    lodash.merge(newElement, update)
    newElements[index] = newElement
    state.project.elements = newElements
    // state.project.elements[index] = newElement
  },
  updateGlobals (state, update) {
    var newGlobals = deepcopy(state.globals)
    lodash.merge(newGlobals, update)
    state.globals = newGlobals
  },
  addElement (state, elementType) {
    var newElement = deepcopy(defaultElements[elementType])
    newElement.id = generateRandomID()
    console.log(newElement)
    state.project = Object.assign({}, state.project, {
      elements: [...state.project.elements, newElement]
    })
  },
  duplicateElement (state, elementId) {
    var newElements = state.project.elements.slice()
    var [element, index] = elementAndIndex(elementId, state)
    var newElement = deepcopy(element)
    newElement.id = generateRandomID()
    newElements.splice(index + 1, 0, newElement)
    state.project.elements = newElements
  },
  deleteElement (state, elementId) {
    var newElements = state.project.elements.slice()
    var index = elementAndIndex(elementId, state)[1]
    newElements.splice(index, 1)
    state.project.elements = newElements
  },
  moveElementUp (state, elementId) {
    var [element, index] = elementAndIndex(elementId, state)
    console.log(element, index, elementId)
    var indexUp = Math.max(0, index - 1)
    var newElements = state.project.elements.slice()
    newElements[index] = state.project.elements[indexUp]
    newElements[indexUp] = element
    state.project.elements = newElements
  },
  moveElementDown (state, elementId) {
    var [element, index] = elementAndIndex(elementId, state)
    var indexDown = Math.min(state.project.elements.length - 1, index + 1)
    var newElements = state.project.elements.slice()
    newElements[index] = state.project.elements[indexDown]
    newElements[indexDown] = element
    state.project.elements = newElements
  },
  setDefaultStartingProject (state) {
    state.project = { ...defaultStartingProject }
  }
}
