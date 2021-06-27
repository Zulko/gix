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
  g(v-if="showTransformationHandle", :transform="elementTransform(yOffset)")
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

function computeElementCenter(element) {
  const diff = {
    x: {
      left: element.size.width / 2,
      center: 0,
      right: -element.size.width / 2,
    }[element.position.xAlign],
    y: {
      top: element.size.height / 2,
      center: 0,
      bottom: -element.size.height / 2,
    }[element.position.yAlign],
  };
  const angleRadian = (element.position.rotation * 2 * Math.PI) / 360;
  return {
    x: element.position.x + diff.x * Math.cos(angleRadian) + diff.y * Math.sin(angleRadian),
    y: element.position.y + diff.x * Math.sin(angleRadian) + diff.y * Math.cos(angleRadian),
  };
}

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
      elementCenter: { x: 0, y: 0 },
    };
  },
  computed: {
    overlaySvg() {
      const { element } = this;
      if (element.type === 'asset') {
        return `<g transform="${this.elementTransform()}">
          <rect
          x="${-element.size.width / 2}"
          y="${-element.size.height / 2}"
          opacity=0
          fill='red'
          height="${this.element.size.height}px"
          width="${this.element.size.width}px"
        /></g>`;
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
        height = this.element.text.split('\n').length * this.element.font.size;
      } else {
        height = this.element.size.height;
      }
      return height < 60;
    },
  },
  methods: {
    contextMenu(evt) {
      evt.preventDefault();
      this.$emit('context-menu', { element: this.element, evt });
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
    async updateElementDimensions() {
      const [svgElement] = this.$el.children;
      if (!svgElement) {
        return;
      }
      if (this.element.type === 'text') {
        const bbox = svgElement.getBBox();
        this.elementCenter = {
          x: bbox.x + 0.5 * bbox.width,
          y: bbox.y + 0.5 * bbox.height,
        };
      } else {
        this.elementCenter = computeElementCenter(this.element);
      }
    },
    elementTransform(yOffset = 0) {
      const { x, y } = this.elementCenter;
      return `
        translate(${x}, ${y})
        rotate(${this.element.position.rotation || 0})
        translate(0, ${yOffset})
      `;
    },
  },
  components: {
    'transform-handle': TransformHandle,
  },
  mounted() {
    this.updateElementDimensions();
  },
  watch: {
    element: {
      deep: true,
      handler() {
        this.updateElementDimensions();
      },
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
}
</style>
