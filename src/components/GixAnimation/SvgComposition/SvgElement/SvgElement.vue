<template lang="pug">
g.svg-element(:transform='transform',  @mousedown="onMouseDown",
              :style="{cursor: mouseCursorType}")
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
    },
    transform () {
      var x = this.element.position.x + (this.drag ? this.drag.x : 0)
      var y = this.element.position.y + (this.drag ? this.drag.y : 0)
      return `translate(${x}, ${y})`
    },
    mouseCursorType () {
      if (this.element.isDraggable) {
        return this.drag ? 'move' : 'pointer'
      } else {
        return 'default'
      }
    }
  },
  methods: {
    animationClass (animation) {
      if (animation.class === 'none') {
        return ''
      } else {
        return `animated ${animation.class} ${animation.speed}`
      }
    },
    onMouseDown (evt) {
      if (this.element.isDraggable) {
        this.$emit('startdragging', {element: this.element, evt})
      }
    }
  }
}
</script>
<style lang='scss'>
.svg-element {
  user-select: none; /* supported by Chrome and Opera */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  &.cursor-pointer {
    cursor: pointer;
  }
}
</style>
