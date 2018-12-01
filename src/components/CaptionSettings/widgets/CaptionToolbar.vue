<template lang="pug">
.caption-toolbar
  .caption-toolbar-icons
    el-tooltip(content='Move caption up' placement='top')
      span.caption-toolbar-icon(@click='moveCaptionUp(caption.id)')
        icon(name='arrow-up')
    el-tooltip(content='Move caption down' placement='top')
      span.caption-toolbar-icon(@click='moveCaptionDown(caption.id)')
        icon(name='arrow-down')
    el-tooltip(content='Duplicate caption' placement='top')
      span.caption-toolbar-icon(@click='duplicateCaption(caption.id)')
        icon(name='clone')
    el-tooltip(content='Delete caption' placement='top')
      span.caption-toolbar-icon(@click='deleteCaption(caption.id)')
        icon(name='trash')
</template>

<script>
import { mapMutations } from 'vuex'

export default {
  extends: require('../CaptionComponent.vue').default,
  computed: {
    colorCircleStyle () {
      return {
        backgroundColor: this.caption.font.color,
        border: `1px solid ${this.caption.font.strokeColor || 'grey'}`
      }
    }
  },
  methods: {
    ...mapMutations([
      'duplicateCaption',
      'deleteCaption',
      'moveCaptionUp',
      'moveCaptionDown'
    ]),
    bla () {
      console.log('bla')
    }
  }
}
</script>

<style lang='scss' scoped>
.caption-toolbar {
  position: relative;
  height:5mm;
  color: #fff;
  .caption-toolbar-icons {
    float: right;
  }
  .color-circle {
    float:left;
    width: 12px;
    height: 12px;
    border-radius: 12px;
  }
  .caption-toolbar-icon {
    cursor: pointer;
    margin-left: 4mm;
  }
}
</style>
