<template lang="pug">
.element-settings-list
  h2.title Elements
  .settings-list-container(:style="{maxHeight: (0.6 * windowHeight) + 'px'}")
    .settings-list
      transition-group(name='element-settings-list'
                      tag='div')
        .element-settings(v-for='element, i in $store.state.project.elements',
                          :key='element.id',
                          :is='settingsComponents[element.type]',
                          :element='element')
        .add-element(align='center' key='add-element')
          el-tooltip(content='Add another element')
            el-button(icon='el-icon-plus' circle, @click='addElementAndScroll()')
</template>

<script>
import ElementSettings from './ElementSettings'
import TextElementSettings from './TextElementSettings/TextElementSettings'
import { mapMutations } from 'vuex'

export default {
  data () {
    return {
      windowHeight: '1000px',
      settingsComponents: {
        'text': TextElementSettings
      }
    }
  },
  components: {
    'element-settings': ElementSettings
  },
  methods: {
    ...mapMutations([
      'addElement'
    ]),
    handleResize () {
      this.windowHeight = document.documentElement.clientHeight
    },
    addElementAndScroll () {
      this.addElement()
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
.element-settings-list {
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
.element-settings-list-enter, .element-settings-list-leave-active {
  opacity: 0;
  transform: translateX(-500px);
}
.add-element, .element-settings {
  transition: all 0.4s;
}

.add-element i {
  font-size: 30px !important;
}
</style>
