<template lang="pug">
g.svg-element(
  @mouseover="isHovered = true",
  @mouseleave="isHovered = false",
  :transform="transform"
)
  g(
    @mousedown="onMouseDown",
    v-if="element.show || drag",
    v-html="element.innerSVG",
    :style="{ cursor: 'move' }"
  )
  rotation-handle(
    :element="element",
    :drag="dragType === 'rotation' ? drag : null",
    @drag="(evt) => $emit('drag', evt)",
    v-if="showRotationHandle"
  )
</template>

<script>
import RotationHandle from './RotationHandle.vue';

export default {
  name: 'SvgElement',
  props: {
    element: { default: () => ({}), type: Object },
    drag: { default: () => null, type: Object },
    dragType: { default: '', type: String },
  },
  data() {
    return {
      isHovered: false,
    };
  },
  computed: {
    transform() {
      if (this.drag && this.dragType === 'translation') {
        const x = this.drag.x || 0;
        const y = this.drag.y || 0;
        return `translate(${x}, ${y})`;
      }
      if (this.drag && this.dragType === 'rotation') {
        // console.log(this.drag, Math.atan2(this.drag.x, this.drag.y + 20));
        const atan = Math.atan2(20 - this.drag.y, this.drag.x);
        const dragAngle = parseInt((-360 * atan) / (2 * Math.PI) + 90, 10);
        return `rotate(${dragAngle} ${this.element.position.x} ${this.element.position.y})`;
      }
      return '';
    },
    showRotationHandle() {
      return (
        (this.element.show || this.drag) &&
        (this.dragType === 'rotation' || this.isHovered) &&
        !this.element.editorSettings.isMainElement
      );
    },
    mouseCursorType() {
      if (this.element.editorSettings.isDraggable) {
        return 'move'; // this.drag ? 'move' : 'pointer';
      }
      return 'default';
    },
    // dragTransformedElement() {
    //   if (this.drag && this.dragType === 'translation') {
    //     const position = {
    //       ...this.element.position,
    //       x: this.element.position.x + this.drag.x,
    //       y: this.element.position.y + this.drag.y,
    //     };
    //     return { ...this.element, position };
    //   }

    //   return this.element;
    // },
  },
  methods: {
    onMouseDown(evt) {
      if (this.element.editorSettings.isDraggable) {
        this.$emit('drag', { element: this.element, dragType: 'translation', evt });
      }
    },
  },
  components: {
    'rotation-handle': RotationHandle,
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
}
</style>
