export const STORAGE_KEY = 'gix-settings';

export const state = {
  savedProjects: {},
  assetStats: {},
  project: {},
  globals: {
    gifClickMode: {
      mode: 'none',
      targetElement: null,
    },
    lastClickedElement: null,
  },
};
