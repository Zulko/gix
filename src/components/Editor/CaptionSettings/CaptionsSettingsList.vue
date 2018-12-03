<template lang="pug">
.caption-settings-list
  h2.title Captions
  .settings-list-container(:style="{maxHeight: (0.6 * windowHeight) + 'px'}")
    .settings-list
      transition-group(name='caption-settings-list'
                      tag='div')
        caption-settings(v-for='caption, i in $store.state.project.captions',
                        :key='caption.id',
                        :caption='caption')
        .add-caption(align='center' key='add-caption')
          el-tooltip(content='Add another caption')
            el-button(icon='el-icon-plus' circle, @click='addCaptionAndScroll()')
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  data () {
    return {
      windowHeight: '1000px'
    }
  },
  components: {
    'caption-settings': require('./CaptionSettings.vue').default
  },
  methods: {
    ...mapMutations([
      'addCaption'
    ]),
    handleResize () {
      this.windowHeight = document.documentElement.clientHeight
    },
    addCaptionAndScroll () {
      this.addCaption()
      var el = this.$el
      setTimeout(function () {
        el.scrollTop = el.scrollHeight
        console.log(el.scrollTop, el.scrollHeight)
      }, 200)
    }
  },
  mounted () {
    window.addEventListener('resize', this.handleResize)
    this.handleResize()
  }
}
</script>

<style lang='scss'>
.caption-settings-list {
  .settings-list-container {
    padding-left: 10px;
    overflow-x: hidden;
    overflow-y: auto;
    direction: rtl;
    .settings-list {
      direction: ltr;
    }
  }
}
h2.title {
  margin-top: 0;
}
.caption-settings-list-enter, .caption-settings-list-leave-active {
  opacity: 0;
  transform: translateX(-500px);
}
.add-caption, .caption-settings {
  transition: all 0.4s;
}

.add-caption i {
  font-size: 30px !important;
}
</style>
