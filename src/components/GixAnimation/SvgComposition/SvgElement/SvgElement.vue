<template lang="pug">
g.svg-element(:transform='`translate(${element.position.x + (drag ? drag.x : 0)}, ${element.position.y + (drag ? drag.y : 0)})`',
              @mousedown="evt => $emit('startdragging', {element, evt})"
              )
  transition(name="custom-classes-transition"
             :enter-active-class="animationClass(element.cssAnimation.in)",
             :leave-active-class="animationClass(element.cssAnimation.out)")
    template(v-if="element.type === 'group'")
      svg-element(v-for="subElement in element.elements"
                  :key='subElement.id'
                  :currentTime='currentTime'
                  :element='element')
    template(v-else)
      .element-content(
        v-if="showElement || drag"
        :is='svgElementComponents[element.type]'
        :class="animationClass(element.cssAnimation.loop) + ' infinite'"
        :element='element')
</template>

<script>
import TextSvg from './TextSvg'
import ShapeSvg from './ShapeSvg'
import ImageSvg from './ImageSvg'
export default {
  name: 'svg-element',
  props: {
    currentTime: {default: 0},
    element: {default: () => ({})},
    drag: null
  },
  data () {
    return {
      svgElementComponents: {
        text: TextSvg,
        image: ImageSvg,
        shape: ShapeSvg
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
        return `animated ${animation.class} ${animation.speed}`
      }
    }
  }
}
</script>
<style>
.svg-element {
  cursor: pointer;
  user-select: none; /* supported by Chrome and Opera */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
}
</style>
