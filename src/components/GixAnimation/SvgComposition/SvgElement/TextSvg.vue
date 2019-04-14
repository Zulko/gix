<template lang="pug">
g
  text(v-for="style in (element.stroke.width ? ['stroke', 'fill'] : ['fill'])"
       :style="textStyle[style]",
       :key='style'
       :transform='yTranslation'
       )
    tspan(v-for='line, i in textLines' x="0"
          :key='i' :dy="element.position.lineHeight + 'em'") {{line}}
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
        center: 'middle',
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
      var fill = {
        'font-family': `${el.font.family}, Arial`,
        'font-size': el.font.size + 'px',
        'font-weight': el.font.bold ? 'bold' : 'normal',
        'fill': el.color,
        'text-anchor': this.textAnchorsTable[el.position.xAlign]
        // 'alignment-baseline': this.alignmentBaselinesTable[el.position.yAlign]
      }
      var stroke = Object.assign({}, fill, {
        'stroke': el.stroke.color,
        'strokeWidth': 2 * el.stroke.width
      })
      return {stroke, fill}
    },
    textLines () {
      return this.element.text.split('\n')
    },
    yTranslation () {
      // return i + 'em'
      var nLines = this.textLines.length
      var offset = {
        top: 0,
        center: nLines / 2.0,
        bottom: nLines
      }[this.element.position.yAlign]
      var value = -offset * this.element.position.lineHeight * this.element.font.size
      return `translate(0, ${value})`
    }
  }
}
</script>
