export const STORAGE_KEY = 'gix-settings'

export const state = {
  savedProjects: [],
  globals: {
    recordFrames: false,
    gifFramesReady: false,
    gifWriter: null,
    gifClickMode: {
      mode: 'none',
      targetElement: null
    },
    lastClickedElement: null
  },
  project: {}
}
