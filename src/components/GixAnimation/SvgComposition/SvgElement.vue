<template lang="pug">
g.svg-element(
  @mouseover="isHovered = true",
  @mouseleave="isHovered = false",
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
    showRotationHandle() {
      return (
        (this.element.show) &&
        (this.isHovered) &&
        !this.element.editorSettings.isMainElement
      );
    },
    showResizingHandle() {
      return (
        (this.element.show) &&
        (this.isHovered) &&
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
      evt.preventDefault();
      this.$emit('context-menu', { element: this.element, evt });
    },
    onMouseDown(evt) {
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
