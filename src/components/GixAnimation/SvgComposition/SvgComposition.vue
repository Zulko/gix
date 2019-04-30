<template lang="pug">
.svg-composition(@mouseup='stopDragging', @mousemove='updateDrag' @mouseleave='cancelDragging')
  svg(
    :width="svgWidth", :height="svgHeight"
    :viewbox="`0 0 ${svgWidth} ${svgHeight}`",
    xmlns="http://www.w3.org/2000/svg",
    :style="style")
    svg-element(v-for='element in svgElements', :key='element.id',
                :element='element', :currentTime='currentTime'
                :drag='(draggedElement && (element.id === draggedElement.id)) ? drag : null'
                @startdragging='startDragging')
</template>
<script>
import { cloneWithInlineStyle } from './inlineSvgStyles'
import SvgElement from './SvgElement/SvgElement'
export default {
  props: {
    inlineStyles: {default: true},
    svgElements: {default: ([])},
    svgWidth: {default: 100},
    svgHeight: {default: 100},
    currentTime: {default: 0}
  },
  data () {
    return {
      svgDomElement: null,
      draggedElement: null,
      dragInit: null,
      drag: {
        x: 0,
        y: 0
      }
    }
  },
  mounted () {
    this.svgDomElement = this.$el.getElementsByTagName('svg')[0]
    console.log(this.svgDomElement)
  },
  methods: {
    startDragging (e) {
      this.draggedElement = e.element
      this.dragInit = {
        x: e.evt.clientX,
        y: e.evt.clientY
      }
    },
    cancelDragging (e) {
      this.dragInit = null
      this.draggedElement = null
      this.drag = {
        x: 0,
        y: 0
      }
    },
    updateDrag (e) {
      if (this.dragInit) {
        this.drag = {
          x: e.clientX - this.dragInit.x,
          y: e.clientY - this.dragInit.y
        }
      }
    },
    stopDragging (e) {
      if (this.dragInit) {
        this.$emit('dragged', {element: this.draggedElement, drag: this.drag})
      }
      this.cancelDragging()
    }
  },
  watch: {
    svgElements: {
      deep: true,
      handler () {
        var svgElement
        if (this.inlineStyles) {
          svgElement = cloneWithInlineStyle(this.svgDomElement)
        } else {
          svgElement = this.svgDomElement
        }
        var svg = new XMLSerializer().serializeToString(svgElement)
        this.$emit('newFrame', svg)
      }
    }
  },
  computed: {
    style () {
      return {
        width: this.svgWidth + 'px',
        height: this.svgHeight + 'px'
      }
    }
  },
  components: {
    'svg-element': SvgElement
  }
}
</script>
