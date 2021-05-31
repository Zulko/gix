export const STORAGE_KEY = 'gix-settings';

export const state = {
  savedProjects: {},
  assetStats: {},
  project: {},
  freezeGifPreview: false,
  globals: {
    activeEditorElementTab: 0,
    gifClickMode: {
      mode: 'none',
      targetElement: null,
    },
    lastClickedElement: null,
  },
};
