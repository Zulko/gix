import createPersistedState from 'vuex-persistedstate';

const config = { paths: ['savedProjects'] };
const persistedStatePlugin =
  process.env.NODE_ENV !== 'production'
    ? createPersistedState({ key: 'test-gix-data', ...config })
    : createPersistedState({ key: 'gix-data', ...config });

export default [persistedStatePlugin];
