<template lang="pug">
g.svg-element(:transform='`translate(${element.position.x} ${element.position.y})`')
  transition(
    name="custom-classes-transition"
    :enter-active-class="animationClass(element.animation.in)"
    :leave-active-class="animationClass(element.animation.out)")
    text(
      :class="animationClass(element.animation.loop) + ' infinite'"
      v-if="showText"
      :style="textStyle") {{element.text}}
</template>

<script>
export default {
  props: {
    currentTime: {default: 0},
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
    },
    showText () {
      let segment = this.element.timeSegment
      return (this.currentTime >= segment.start) && (this.currentTime <= segment.end)
    }
  },
  methods: {
    animationClass (animation) {
      if (animation.class[0] === 'none') {
        return ''
      } else {
        return `animated ${animation.class.join(' ')} ${animation.speed}`
      }
    }
  }
}
</script>
