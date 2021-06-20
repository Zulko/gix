<template lang="pug">
.svg-composition(
  @mousemove="handleMouseMove",
  @mouseup="dragInit = null; $emit('draggingStopped')",
  @mouseleave="onMouseLeave"
)
  svg(
    :viewBox="`0 0 ${svgWidth} ${svgHeight}`",
    xmlns="http://www.w3.org/2000/svg",
    :style="style"
  )
    svg-element(
      v-for="(element, i) in svgElements",
      :key="`'${i}-${element.id}'`",
      :element="element",
      @drag="startDragging",
      @context-menu="(evt) => $emit('context-menu', evt)"
    )
</template>
<script>
import SvgElement from './SvgElement.vue';

export default {
  props: {
    inlineStylesInEmittedSVG: { default: true, type: Boolean },
    svgElements: { default: () => [], type: Array },
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
      draggingProps: null,
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
      this.draggingProps = e;
      this.dragInit = {
        x: e.evt.clientX,
        y: e.evt.clientY,
      };
    },
    handleMouseMove(e) {
      const { draggingProps } = this;
      if (this.dragInit) {
        const drag = {
          x: (e.clientX - this.dragInit.x) / this.scale,
          y: (e.clientY - this.dragInit.y) / this.scale,
        };
        this.$emit('dragging', { drag, draggingProps });
      }
    },
    onMouseLeave() {
      if (this.dragInit) {
        this.$emit('draggingStopped');
        this.dragInit = null;
      }
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
