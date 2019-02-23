export const STORAGE_KEY = 'gix-settings'

export const state = {
  savedProjects: [],
  globals: {
    source: {
      height: 0,
      width: 0,
      duration: 0,
      fps: 0
    },
    gifClickMode: {
      mode: 'none',
      targetElement: null
    }
  },
  project: {}
}
