import createPersistedState from 'vuex-persistedstate'

export default process.env.NODE_ENV !== 'production'
  ? []
  : [createPersistedState({key: 'gix-data'})]
