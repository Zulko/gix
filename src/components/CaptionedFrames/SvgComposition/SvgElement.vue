<template lang="pug">
g.svg-element(:transform='`translate(${element.position.x} ${element.position.y})`')
  transition(name="custom-classes-transition"
             :enter-active-class="animationClass(element.animation.in)"
             :leave-active-class="animationClass(element.animation.out)")
    template(v-if="element.type === 'group'")
      svg-element(v-for="subElement in element.elements"
                  :currentTime='currentTime'
                  :element='element')
    template(v-else)
      .element-content(
        v-if="showElement"
        is='svgElementComponents[element.type]'
        :class="animationClass(element.animation.loop) + ' infinite'"
        :element='element')
</template>

<script>
export default {
  name: 'svg-element',
  props: {
    currentTime: {default: 0},
    element: {default: () => ({})}
  },
  data () {
    return {
      svgElementComponents: {
        text: SvgTextElement,
        asset: SvgAssetElement,
        shape: SvgshapeElement
      }
    }
  },
  computed: {
    showElement () {
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
