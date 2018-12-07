<template lang="pug">
.element-toolbar
  .element-toolbar-icons
    el-tooltip(content='Move element up' placement='top')
      span.element-toolbar-icon(@click='moveElementUp(element.id)')
        icon(name='arrow-up')
    el-tooltip(content='Move element down' placement='top')
      span.element-toolbar-icon(@click='moveElementDown(element.id)')
        icon(name='arrow-down')
    el-tooltip(content='Duplicate element' placement='top')
      span.element-toolbar-icon(@click='duplicateElement(element.id)')
        icon(name='clone')
    el-tooltip(content='Delete element' placement='top')
      span.element-toolbar-icon(@click='deleteElement(element.id)')
        icon(name='trash')
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  extends: require('./ElementComponentMixin.vue').default,
  computed: {
    colorCircleStyle () {
      return {
        backgroundColor: this.element.font.color,
        border: `1px solid ${this.element.font.strokeColor || 'grey'}`
      }
    }
  },
  methods: {
    ...mapMutations([
      'duplicateElement',
      'deleteElement',
      'moveElementUp',
      'moveElementDown'
    ]),
    bla () {
      console.log('bla')
    }
  }
}
</script>

<style lang='scss' scoped>
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
</style>
