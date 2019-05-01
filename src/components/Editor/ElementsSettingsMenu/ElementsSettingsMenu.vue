<template lang="pug">
.element-settings-list
  h2.title Elements
  .element-adder
    element-adder(key='add-element' @addElement='addElementAndScroll')
  .elements-carousel
    el-carousel(type='card', height="500px" :autoplay='false', :initial-index='currentCarouselIndex'
                :loop='false' ref="elementssettingscarousel", @change='onCarouselChange')
      el-carousel-item(v-for='element, i in $store.state.project.elements',
                        :key='i', :name='element.id')
        el-card
          .element-toolbar(slot='header')
            .element-toolbar-icons(v-if='i === currentCarouselIndex')
              el-tooltip(content='Move element up' placement='top')
                span.element-toolbar-icon(@click='moveElementUpAndUpdate(element.id)')
                  icon(name='arrow-up')
              el-tooltip(content='Move element down' placement='top')
                span.element-toolbar-icon(@click='moveElementDownAndUpdate(element.id)')
                  icon(name='arrow-down')
              el-tooltip(content='Duplicate element' placement='top')
                span.element-toolbar-icon(@click='duplicateElementAndScroll(element.id)')
                  icon(name='clone')
              el-tooltip(content='Delete element' placement='top')
                span.element-toolbar-icon(@click='deleteElement(element.id)')
                  icon(name='trash')
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
      'addElement',
      'duplicateElement',
      'deleteElement',
      'moveElementUp',
      'moveElementDown'
    ]),
    addElementAndScroll (elementType) {
      this.addElement(elementType)
      var self = this
      setTimeout(function () {
        var len = self.$store.state.project.elements.length
        var lastElement = self.$store.state.project.elements[len - 1]
        self.$refs.elementssettingscarousel.setActiveItem(lastElement.id)
      }, 100)
    },
    duplicateElementAndScroll (elementId) {
      this.duplicateElement(elementId)
      var self = this
      setTimeout(function () {
        self.$refs.elementssettingscarousel.next()
      }, 200)
    },
    moveElementUpAndUpdate (elementId) {
      var self = this
      var index = this.$store.state.project.elements.map(c => c.id).indexOf(elementId)
      if (index > 0) {
        this.moveElementUp(elementId)
        setTimeout(function () {
          self.$refs.elementssettingscarousel.prev()
        }, 100)
      }
    },
    moveElementDownAndUpdate (elementId) {
      var self = this
      var index = this.$store.state.project.elements.map(c => c.id).indexOf(elementId)
      if (index < this.$store.state.project.elements.length) {
        this.moveElementDown(elementId)
        setTimeout(function () {
          self.$refs.elementssettingscarousel.next()
        }, 100)
      }
    },
    onCarouselChange (index, oldIndex) {
      console.log('changed', index, oldIndex)
      this.currentCarouselIndex = index
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
  .el-card__header {
     background-color: #bdddfc !important;
     padding: 1mm !important;
  }
  .el-card__body {
    padding: 1mm 4mm 4mm 4mm;
  }
  .el-tabs__content {
    padding: 0em 0.8em 0em 0.8em !important;
  }
  .property-title {
    font-weight: bold;
    text-transform: capitalize;
    color: gray;
    margin: 0 0 0.5em 0;
    text-align: center;
  }
  .el-input-number.is-controls-right .el-input__inner {
    padding-left: 2px;
    padding-right: 30px;
  }
  .el-tabs__item {
    padding-top: 5px !important ;
    svg {
      height: 20px;
    }
  }
  .icon svg {
    height: 20px;
  }
  .element-toolbar {
  position: relative;
  height:5mm;
  color: #fff;
  .element-toolbar-icons {
    float: right;
  }
  .color-circle {
    float:left;
    width: 12px;
    height: 12px;
    border-radius: 12px;
  }
  .element-toolbar-icon {
    cursor: pointer;
    margin-left: 4mm;
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
