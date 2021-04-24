<template lang="pug">
.svg-composition(
  @mouseup='stopDragging',
  @mousemove='updateDrag'
  @mouseleave='cancelDragging'
)
  svg(
    :viewBox="`0 0 ${svgWidth} ${svgHeight}`",
    xmlns="http://www.w3.org/2000/svg",
    :style="style"
  )
    svg-element(
      v-for='element in svgElements', :key='element.id',
      :element='element'
      :drag='(draggedElement && (element.id === draggedElement.id)) ? drag : null'
      @startdragging='startDragging'
    )
</template>
<script>
// import { cloneWithInlineStyle } from './inlineSvgStyles';
import SvgElement from './SvgElement.vue';

export default {
  props: {
    inlineStylesInEmittedSVG: { default: true, type: Boolean },
    svgElements: { default: () => ([]), type: Array },
    svgWidth: { default: 100, type: Number },
    svgHeight: { default: 100, type: Number },
    scale: { default: 1, type: Number },
    backgroundColor: { default: 'black', type: String },
    emitSVG: { default: true, type: Boolean },
  },
  data() {
    return {
      svgDomElement: null,
      draggedElement: null,
      dragInit: null,
      drag: {
        x: 0,
        y: 0,
      },
    };
  },
  mounted() {
    this.svgDomElement = this.$el.getElementsByTagName('svg')[0]; //eslint-disable-line
  },
  methods: {
    startDragging(e) {
      this.draggedElement = e.element;
      this.dragInit = {
        x: e.evt.clientX,
        y: e.evt.clientY,
      };
    },
    cancelDragging() {
      this.dragInit = null;
      this.draggedElement = null;
      this.drag = {
        x: 0,
        y: 0,
      };
    },
    updateDrag(e) {
      if (this.dragInit) {
        this.drag = {
          x: (e.clientX - this.dragInit.x) / this.scale,
          y: (e.clientY - this.dragInit.y) / this.scale,
        };
      }
    },
    stopDragging() {
      if (this.dragInit) {
        this.$emit('dragged', { element: this.draggedElement, drag: this.drag });
      }
      this.cancelDragging();
    },
  },
  computed: {
    style() {
      return {
        width: `${this.svgWidth * this.scale}px`,
        height: `${this.svgHeight * this.scale}px`,
        backgroundColor: this.backgroundColor,
      };
    },
  },
  components: {
    'svg-element': SvgElement,
  },
};
</script>
