<template lang="pug">
.golbal-time-form
  el-form
    el-form-item(label='Height')
      el-input-number(
        size='small', controls-position="right",
        :step='0.05',
        v-model='projectHeight')
    el-form-item(label='Width')
      el-input-number(
        size='small', controls-position="right",
        v-model='projectWidth')
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  computed: {
    projectWidth: {
      get () {
        return this.$store.state.project.canvas.width
      },
      set (value) {
        this.$store.commit('updateProject', {canvas: {width: value}})
      }
    },
    projectHeight: {
      get () {
        return this.$store.state.project.canvas.height
      },
      set (value) {
        this.$store.commit('updateProject', {canvas: {height: value}})
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
