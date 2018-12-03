<template lang="pug">
text(:style="textStyle") {{element.text}}
</template>
<script>
export default {
  props: {
    element: {default: () => ({})}
  },
  data () {
    return {
      data () {
    return {
      alignmentBaselinesTable: {
        top: 'hanging',
        middle: 'middle',
        bottom: 'baseline'
      },
      textAnchorsTable: {
        left: 'start',
        center: 'middle',
        right: 'end'
      }
    }
  },
  computed: {
    textStyle () {
      return {
        'font-family': `${this.element.font.family}, Arial`,
        'font-size': this.element.font.size + 'px',
        'font-weight': this.element.font.bold ? 'bold' : 'normal',
        'fill': this.element.font.color,
        'stroke': this.element.font.stroke.color,
        'strokeWidth': this.element.font.stroke.width,
        'text-anchor': this.textAnchorsTable[this.element.position.xAlign],
        'alignment-baseline': this.alignmentBaselinesTable[this.element.position.yAlign]
      }
    }
  },

}
</script>

