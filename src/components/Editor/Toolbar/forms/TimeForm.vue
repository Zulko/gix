<template lang="pug">
.golbal-time-form
  el-form
    el-form-item(label='Duration')
      el-input-number(
        size='small', controls-position="right",
        :step='0.05',
        v-model='projectDuration')
    el-form-item(label='FPS')
      el-input-number(
        size='small', controls-position="right",
        v-model='projectFPS')
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  computed: {
    projectFPS: {
      get () {
        return this.$store.state.project.fps
      },
      set (value) {
        console.log(value)
        this.$store.commit('updateProject', {fps: value})
      }
    },
    projectDuration: {
      get () {
        return this.$store.state.project.duration
      },
      set (value) {
        console.log(value)
        this.$store.commit('updateProject', {duration: value})
      }
    }
  },
  methods: {
    ...mapMutations([
      'updateProject'
    ])
  }
}
</script>
