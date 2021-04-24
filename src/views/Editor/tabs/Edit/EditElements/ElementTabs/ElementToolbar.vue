<template lang="pug">
.element-toolbar
  b-field(position='is-right')
    p.control
      b-button(
        size="is-small"
        icon-left='arrow-bottom-left'
        @click='moveElementUpAndUpdate()'
      ) Move down
    p.control
      b-button(
        size="is-small"
        @click='moveElementDownAndUpdate()'
        icon-left='arrow-top-right'
      ) Move up
    p.control
      b-button(
        size="is-small"
        @click='duplicateElement(elementId)'
        icon-left='content-copy'
      ) Duplicate
    p.control
      b-button(
        size="is-small"
        @click='deleteElement(elementId)'
        icon-left='delete'
      ) Delete
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  props: {
    elementId: { default: 'default', type: String },
  },
  methods: {
    ...mapMutations([
      'duplicateElement',
      'deleteElement',
      'moveElementUp',
      'moveElementDown',
    ]),
    moveElementUpAndUpdate() {
      const index = this.$store.state.project.elements.map((c) => c.id).indexOf(this.elementId);
      if (index > 0) {
        this.moveElementUp(this.elementId);
      }
    },
    moveElementDownAndUpdate() {
      const index = this.$store.state.project.elements.map((c) => c.id).indexOf(this.elementId);
      if (index < this.$store.state.project.elements.length) {
        this.moveElementDown(this.elementId);
      }
    },
  },
};
</script>

<style lang='scss' scoped>
 .element-toolbar {
    display: block;
    text-align: center;
    margin-top: 0em;
    margin-bottom: 0em;
  }
</style>
