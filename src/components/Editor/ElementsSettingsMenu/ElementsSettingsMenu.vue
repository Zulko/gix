<template lang="pug">
.element-settings-list
  h2.title Elements
  .element-adder
    element-adder(key='add-element' @addElement='addElementAndScroll')
  .elements-carousel
    el-carousel(type='card', height="500px" :autoplay='false',
                :loop='false' ref="elementssettingscarousel", @change='onCarouselChange')
      el-carousel-item(v-for='element, i in $store.state.project.elements',
                        :key='i', :name='element.id')
        .element-settings(:is='settingsComponents[element.type]',
                          :element='element', :showOptions='i === currentCarouselIndex')
</template>

<script>
import ElementSettings from './ElementSettings'
import ElementAdder from './ElementAdder'
import TextSettings from './TextSettings/TextSettings'
import AssetSettings from './AssetSettings/AssetSettings'
import { mapMutations } from 'vuex'

export default {
  data () {
    return {
      currentCarouselIndex: 0,
      settingsComponents: {
        'text': TextSettings,
        'asset': AssetSettings
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
    addElementAndScroll (elementType) {
      this.addElement(elementType)
      var self = this
      setTimeout(function () {
        var len = self.$store.state.project.elements.length
        var lastElement = self.$store.state.project.elements[len - 1]
        self.$refs.elementssettingscarousel.setActiveItem(lastElement.id)
      })
    },
    onCarouselChange (index, oldIndex) {
      this.currentCarouselIndex = index
      console.log(index, oldIndex)
    }
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
.elements-carousel {
  margin-top: 1cm;
}
</style>
