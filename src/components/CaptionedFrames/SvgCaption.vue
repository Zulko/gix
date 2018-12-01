<template lang="pug">
g.svg-caption(:transform='`translate(${caption.position.x} ${caption.position.y})`')
  transition(
    name="custom-classes-transition"
    :enter-active-class="animationClass(caption.animation.in)"
    :leave-active-class="animationClass(caption.animation.out)")
    text(
      :class="animationClass(caption.animation.loop) + ' infinite'"
      v-if="showText"
      :style="textStyle") {{caption.text}}
</template>

<script>
export default {
  props: {
    currentTime: {default: 0},
    caption: {default: () => ({})}
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
        'font-family': `${this.caption.font.family}, Arial`,
        'font-size': this.caption.font.size + 'px',
        'font-weight': this.caption.font.bold ? 'bold' : 'normal',
        'fill': this.caption.font.color,
        'stroke': this.caption.font.stroke.color,
        'strokeWidth': this.caption.font.stroke.width,
        'text-anchor': this.textAnchorsTable[this.caption.position.xAlign],
        'alignment-baseline': this.alignmentBaselinesTable[this.caption.position.yAlign]
      }
    },
    showText () {
      let segment = this.caption.timeSegment
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
