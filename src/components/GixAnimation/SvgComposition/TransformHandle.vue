<template lang="pug">
g.transform-handle(:style="{ cursor: 'pointer' }", @mousedown="onMouseDown")
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
    style="font-weight: 600; font-family: 'Work Sans'"
  ) {{ symbol }}
</template>
<script>
export default {
  name: 'SvgElement',
  props: {
    element: { default: () => ({}), type: Object },
    type: { default: 'scale', type: String },
  },
  computed: {
    symbol() {
      // ⤡
      return {
        rotate: '↻',
        scale: '⇱',
        scaleWidth: '↔',
        scaleHeight: '↕',
      }[this.type];
    },
    mouseCursorType() {
      if (this.element.editorSettings.isDraggable) {
        return 'move';
      }
      return 'default';
    },
  },
  methods: {
    onMouseDown(evt) {
      if (this.element.editorSettings.isDraggable) {
        this.$emit('drag', { element: this.element, dragType: this.type, evt });
      }
    },
  },
};
</script>
<style lang='scss'>
@import url("https://fonts.googleapis.com/css2?family=Work+Sans:wght@600&display=swap");
.transform-handle {
  user-select: none; /* supported by Chrome and Opera */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
}
