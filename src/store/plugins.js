import createPersistedState from 'vuex-persistedstate';

const config = { paths: [ 'savedProjects' ] };
export default process.env.NODE_ENV !== 'production'
  ? [ createPersistedState({ key: 'test-gix-data', ...config }) ]
  : [ createPersistedState({ key: 'gix-data', ...config }) ];
