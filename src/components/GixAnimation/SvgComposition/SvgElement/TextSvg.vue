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
      var el = this.element
      return {
        'font-family': `${el.font.family}, Arial`,
        'font-size': el.font.size + 'px',
        'font-weight': el.font.bold ? 'bold' : 'normal',
        'fill': el.color,
        'stroke': el.stroke.color,
        'strokeWidth': el.stroke.width,
        'text-anchor': this.textAnchorsTable[el.position.xAlign],
        'alignment-baseline': this.alignmentBaselinesTable[el.position.yAlign]
      }
    }
  }
}
</script>
