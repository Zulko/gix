<template lang="pug">
g.svg-element(
  :transform='transform',
  @mousedown="onMouseDown",
  :style="{cursor: mouseCursorType}"
   v-if="element.show || drag"
   v-html='element.innerSVG'
)
</template>

<script>

export default {
  name: 'SvgElement',
  props: {
    element: { default: () => ({}), type: Object },
    drag: { default: () => (null), type: Object },
  },
  computed: {
    transform() {
      const x = (this.drag ? this.drag.x || 0 : 0);
      const y = (this.drag ? this.drag.y || 0 : 0);
      return `translate(${x}, ${y})`;
    },
    mouseCursorType() {
      if (this.element.editorSettings.isDraggable) {
        return this.drag ? 'move' : 'pointer';
      }
      return 'default';
    },
  },
  methods: {
    onMouseDown(evt) {
      if (this.element.editorSettings.isDraggable) {
        this.$emit('startdragging', { element: this.element, evt });
      }
    },
  },
};
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
