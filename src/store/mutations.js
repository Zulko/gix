import lodash from 'lodash'
import { generateRandomID } from '../tools'
import defaultCaption from './data/default_caption.json'

function captionAndIndex (captionId, state) {
  var index = state.project.captions.map(c => c.id).indexOf(captionId)
  return [state.project.captions[index], index]
}
function deepcopy (obj) {
  return JSON.parse(JSON.stringify(obj))
}

export const mutations = {
  updateCaption (state, {captionId, update}) {
    var [caption, index] = captionAndIndex(captionId, state)
    var newCaptions = state.project.captions.slice()
    var newCaption = deepcopy(caption)
    lodash.merge(newCaption, update)
    newCaptions[index] = newCaption
    state.project.captions = newCaptions
    // state.project.captions[index] = newCaption
  },
  updateGlobals (state, update) {
    var newGlobals = deepcopy(state.globals)
    lodash.merge(newGlobals, update)
    state.globals = newGlobals
  },
  addCaption (state) {
    var newCaption = deepcopy(defaultCaption)
    newCaption.id = generateRandomID()
    state.project.captions = [...state.project.captions, newCaption]
  },
  duplicateCaption (state, captionId) {
    var newCaptions = state.project.captions.slice()
    var [caption, index] = captionAndIndex(captionId, state)
    var newCaption = deepcopy(caption)
    newCaption.id = generateRandomID()
    newCaptions.splice(index + 1, 0, newCaption)
    state.project.captions = newCaptions
  },
  deleteCaption (state, captionId) {
    var newCaptions = state.project.captions.slice()
    var index = captionAndIndex(captionId, state)[1]
    newCaptions.splice(index, 1)
    state.project.captions = newCaptions
  },
  moveCaptionUp (state, captionId) {
    var [caption, index] = captionAndIndex(captionId, state)
    var indexUp = Math.max(0, index - 1)
    var newCaptions = state.project.captions.slice()
    newCaptions[index] = state.project.captions[indexUp]
    newCaptions[indexUp] = caption
    state.project.captions = newCaptions
  },
  moveCaptionDown (state, captionId) {
    var [caption, index] = captionAndIndex(captionId, state)
    var indexDown = Math.min(state.project.captions.length - 1, index + 1)
    var newCaptions = state.project.captions.slice()
    newCaptions[index] = state.project.captions[indexDown]
    newCaptions[indexDown] = caption
    state.project.captions = newCaptions
  }
}
