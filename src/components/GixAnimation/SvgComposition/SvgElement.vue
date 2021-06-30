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
  g(v-if="showTransformationHandle", :transform="elementTransformWithOffset")
    transform-handle(
      v-if="!element.nonRotatable",
      :element="element",
      type="rotate",
      :transform="`translate(-${element.type === 'rectangle' ? 40 : 20}, 0)`",
      @drag="(evt) => $emit('drag', evt)"
    )
    g(v-if="element.type !== 'rectangle'")
      transform-handle(
        :element="element",
        :transform="`translate(20, 0)`",
        type="scale",
        @drag="(evt) => $emit('drag', evt)"
      )
    g(v-else)
      transform-handle(
        :element="element",
        type="scaleWidth",
        @drag="(evt) => $emit('drag', evt)"
      )
      transform-handle(
        :transform="`translate(40, 0)`",
        :element="element",
        type="scaleHeight",
        @drag="(evt) => $emit('drag', evt)"
      )
</template>

<script>
import TransformHandle from './TransformHandle.vue';

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
      isMounted: false,
    };
  },
  computed: {
    elementCenter() {
      const { element } = this;
      if (!this.isMounted) {
        return null;
      }
      const [svgElement] = this.$el.children;
      if (!svgElement) {
        return null;
      }
      if (this.element.type === 'text') {
        const bbox = svgElement.getBBox();
        return {
          x: bbox.x + 0.5 * bbox.width,
          y: bbox.y + 0.5 * bbox.height,
        };
      }
      const sign = (element.isMirror ? 1 : -1);
      const diff = {
        x: {
          left: (sign * element.size.width) / 2,
          center: 0,
          right: -(sign * element.size.width) / 2,
        }[element.xAlign],
        y: {
          top: element.size.height / 2,
          center: 0,
          bottom: -element.size.height / 2,
        }[element.yAlign],
      };
      const angleRadian = (element.rotation * 2 * Math.PI) / 360;
      return {
        x: element.position.x + diff.x * Math.cos(angleRadian) + diff.y * Math.sin(angleRadian),
        y: element.position.y + diff.x * Math.sin(angleRadian) + diff.y * Math.cos(angleRadian),
      };
    },
    overlaySvg() {
      const { element } = this;
      if ((element.type === 'asset') && this.elementTransform) {
        const overlay = `<g transform="${this.elementTransform}">
          <rect
          x="${-element.size.width / 2}"
          y="${-element.size.height / 2}"
          opacity=0
          fill='red'
          height="${this.element.size.height}"
          width="${this.element.size.width}px"
        /></g>`;
        return overlay;
      }
      return '';
    },
    showTransformationHandle() {
      return (
        (this.element.editorSettings.isDraggable) &&
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
    yOffset() {
      if (this.isThin) {
        const sign = this.elementCenter.y < 40 ? 1 : -1;
        return 20 * sign;
      }
      return 0;
    },
    isThin() {
      let height;
      if (this.element.type === 'text') {
        height = this.element.text.split('\n').length * this.element.fontSize;
      } else {
        height = this.element.size.height;
      }
      return height < 60;
    },
    elementTransform() {
      if (!this.elementCenter) {
        console.log('center');
        return '';
      }
      const { x, y } = this.elementCenter;
      const transform = `
        translate(${x}, ${y})
        rotate(${this.element.rotation || 0})
      `;
      return transform;
    },
    elementTransformWithOffset() {
      return `
        ${this.elementTransform}
        translate(0, ${this.yOffset})
      `;
    },
  },
  methods: {
    contextMenu(evt) {
      evt.preventDefault();
      const rect = evt.target.getBoundingClientRect();
      const [svgElement] = this.$el.children;
      const bbox = svgElement.getBBox();
      const svgX = evt.clientX - rect.left + bbox.x;
      const svgY = evt.clientY - rect.top + bbox.y;
      this.$emit('context-menu', {
        element: this.element, evt, svgX, svgY,
      });
    },
    onMouseDown(evt) {
      if (!this.element.nonRotatable) {
        // TODO: what this really means is "not in the cropping menu"
        this.$store.commit('setEditorTabIndexToElementId', this.element.id);
      }
      if (this.element.editorSettings.isDraggable) {
        this.$emit('drag', { element: this.element, dragType: 'translate', evt });
      }
    },
  },
  components: {
    'transform-handle': TransformHandle,
  },
  mounted() {
    this.isMounted = true;
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
