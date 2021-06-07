<template lang="pug">
g.svg-element(
  @mouseover="isHovered = true",
  @mouseleave="isHovered = false",
  :transform="transform",
  @contextmenu="contextMenu"
)
  g(
    v-if="element.show || drag",
    v-html="element.innerSVG",
    :style="{ cursor: 'move' }",
    @mousedown="onMouseDown"
  )
  g(
    v-if="element.type === 'asset' && element.show",
    v-html="overlaySvg",
    :style="{ cursor: 'move' }",
    @mousedown="onMouseDown"
  )
  rotation-handle(
    :element="element",
    :drag="dragType === 'rotation' ? drag : null",
    @drag="(evt) => $emit('drag', evt)",
    v-if="showRotationHandle"
  )
  resizing-handle(
    :element="element",
    :drag="dragType === 'resizing' ? drag : null",
    @drag="(evt) => $emit('drag', evt)",
    v-if="showResizingHandle"
  )
</template>

<script>
import RotationHandle from './RotationHandle.vue';
import ResizingHandle from './ResizingHandle.vue';

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
    overlaySvg() {
      const { element } = this;
      if (element.type === 'asset') {
        const x = {
          left: 0,
          center: -element.size.width / 2,
          right: -element.size.width,
        }[element.position.xAlign];
        const y = {
          top: 0,
          center: -element.size.height / 2,
          bottom: -element.size.height,
        }[this.element.position.yAlign];
        const translation = `translate(${element.position.x}, ${element.position.y})`;
        const rotation = `rotate(${element.position.rotation || 0})`;
        const elementTransform = `${translation} ${rotation}`;
        return `<g transform="${elementTransform}">
          <rect
          x="${x}"
          y="${y}"
          opacity=0
          fill='red'
          height="${this.element.size.height}px"
          width="${this.element.size.width}px"
        /></g>`;
      }
      return '';
    },
    transform() {
      const { position } = this.element;
      if (this.drag && this.dragType === 'translation') {
        const x = this.drag.x || 0;
        const y = this.drag.y || 0;
        return `translate(${x}, ${y})`;
      }
      if (this.drag && this.dragType === 'rotation') {
        const atan = Math.atan2(20 - this.drag.y, this.drag.x);
        const dragAngle = parseInt((-360 * atan) / (2 * Math.PI) + 90, 10);
        return `rotate(${dragAngle} ${position.x} ${position.y})`;
      }
      if (this.drag && this.dragType === 'resizing') {
        const ratio = (20 - this.drag.y) / 20;
        const translation = `translate(${(1 - ratio) * position.x}, ${(1 - ratio) * position.y})`;
        return `${translation} scale(${ratio})`;
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
    showResizingHandle() {
      return (
        (this.element.show || this.drag) &&
        (this.dragType === 'resizing' || this.isHovered) &&
        !this.element.editorSettings.isMainElement
      );
    },
    mouseCursorType() {
      if (this.element.editorSettings.isDraggable) {
        return 'move'; // this.drag ? 'move' : 'pointer';
      }
      return 'default';
    },
  },
  methods: {
    contextMenu(evt) {
      console.log('context', evt);
      evt.preventDefault();
      this.$emit('context-menu', { element: this.element, evt });
    },
    onMouseDown(evt) {
      console.log('mouseDown', evt);
      if (this.element.editorSettings.isDraggable) {
        this.$emit('drag', { element: this.element, dragType: 'translation', evt });
      }
    },
  },
  components: {
    'rotation-handle': RotationHandle,
    'resizing-handle': ResizingHandle,
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
