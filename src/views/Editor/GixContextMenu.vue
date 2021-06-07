<template lang="pug">
.gix-context-menu.box(
  :style="`margin-left: ${position.x}px; margin-top: ${position.y}px;`"
)
  b-menu
    b-menu-list(label="New")
      b-menu-item(
        icon="format-font",
        label="Text",
        @click="addText(offset); $emit('closeMenu')"
      )
      b-menu-item(icon="image", label="Asset", @click="dialogIsVisible = true")
      b-menu-item(
        icon="rectangle-outline",
        label="Rectangle",
        @click="addRectangle(position); $emit('closeMenu')"
      )
    b-menu-list(:label="`This ${element.type}`")
      b-menu-item(
        icon="arrow-bottom-left",
        label="Send backward",
        @click="moveElementUpAndUpdate"
      )
      b-menu-item(
        icon="arrow-top-right",
        label="Send forward",
        @click="moveElementUpAndUpdate"
      )
      b-menu-item(
        icon="content-copy",
        label="Duplicate",
        @click="duplicateElement(elementId); $emit('closeMenu')"
      )
      b-menu-item(
        icon="delete",
        label="Delete",
        @click="deleteElement(elementId); $emit('closeMenu')"
      )

  asset-adding-modal(
    v-model="dialogIsVisible",
    @closeMenu="$emit('closeMenu')"
  )
</template>
<script>
import ElementAdderMixin from './EditorTabs/ElementAdder/ElementAdderMixin';
import ElementToolbarMixin from './EditorTabs/ElementToolbar/ElementToolbarMixin';

export default {
  mixins: [ElementAdderMixin, ElementToolbarMixin],
  props: {
    element: { type: Object },
    position: { type: Object, default: () => ({ x: 0, y: 0 }) },
  },
  computed: {
    elementId() {
      return this.element.id;
    },
    offset() {
      return { x: this.position.xOffset, y: this.position.yOffset };
    },
  },
};
</script>
<style lang='scss'>
.gix-context-menu {
  z-index: 300;
  padding: 0.5rem;
  .menu {
    font-size: 0.8em;
  }
  .menu-list a {
    padding-bottom: 0;
    padding-top: 0;
  }
}
</style>
