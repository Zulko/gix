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
        element-adder(key='add-element' @addElement='addElementAndScroll')
</template>

<script>
import ElementSettings from './ElementSettings'
import ElementAdder from './ElementAdder'
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
    'element-settings': ElementSettings,
    'element-adder': ElementAdder
  },
  methods: {
    ...mapMutations([
      'addElement'
    ]),
    handleResize () {
      this.windowHeight = document.documentElement.clientHeight
    },
    addElementAndScroll (elementType) {
      this.addElement(elementType)
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
    padding-top: 20px;
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
.element-adder, .element-settings {
  transition: all 0.4s;
}
</style>
