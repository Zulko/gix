<template lang="pug">
.svg-composition(
  @mouseup="stopDragging",
  @mousemove="updateDragging",
  @mouseleave="cancelDragging"
)
  svg(
    :viewBox="`0 0 ${svgWidth} ${svgHeight}`",
    xmlns="http://www.w3.org/2000/svg",
    :style="style"
  )
    svg-element(
      v-for="element in svgElements",
      :key="element.id",
      :element="element",
      :drag="draggedElement && element.id === draggedElement.id ? drag : null",
      :dragType="draggedElement && element.id === draggedElement.id ? dragType : null",
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
      dragInit: null,
      dragType: null,
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
      console.log(e);
      this.draggedElement = e.element;
      this.dragType = e.dragType;
      this.dragInit = {
        x: e.evt.clientX,
        y: e.evt.clientY,
      };
    },
    cancelDragging() {
      this.dragInit = null;
      this.dragType = null;
      this.draggedElement = null;
      this.drag = {
        x: 0,
        y: 0,
      };
    },
    updateDragging(e) {
      if (this.dragInit) {
        this.drag = {
          x: (e.clientX - this.dragInit.x) / this.scale,
          y: (e.clientY - this.dragInit.y) / this.scale,
        };
      }
    },
    stopDragging() {
      if (this.dragInit) {
        this.$emit('dragged', {
          element: this.draggedElement,
          drag: this.drag,
          dragType: this.dragType,
        });
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
