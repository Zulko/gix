<template lang="pug">
g.resizing-handle(
  :transform="`translate(${position.x}, ${position.y}) rotate(${position.rotation || 0})`",
  :style="{ cursor: 'pointer' }",
  @mousedown="onMouseDown"
)
  g(:transform="`translate(20, -20)`")
    circle.resizing-handle(
      r="15",
      stroke="white",
      stroke-width="2",
      fill="black"
    )
    text(
      text-anchor="middle",
      alignment-baseline="middle",
      fill="white",
      style="font-weight: bold"
    ) ⤡
</template>
<script>
export default {
  name: 'SvgElement',
  props: {
    element: { default: () => ({}), type: Object },
    drag: { default: () => null, type: Object },
  },
  computed: {
    position() {
      return this.element.position;
    },
    dragTransform() {
      const x = this.drag ? this.drag.x || 0 : 0;
      const y = this.drag ? this.drag.y || 0 : 0;
      return `translate(${x + 20}, ${y - 20})`;
    },
    mouseCursorType() {
      if (this.element.editorSettings.isDraggable) {
        return 'move'; // this.drag ? 'move' : 'pointer';
      }
      return 'default';
    },
  },
  methods: {
    onMouseDown(evt) {
      if (this.element.editorSettings.isDraggable) {
        this.$emit('drag', { element: this.element, dragType: 'resizing', evt });
      }
    },
  },
};
</script>
<style lang='scss'>
.resizing-handle {
  user-select: none; /* supported by Chrome and Opera */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
}
