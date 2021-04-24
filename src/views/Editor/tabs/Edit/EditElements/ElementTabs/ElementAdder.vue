<template lang="pug">
.element-adder
  h2 Add a new element
  section.section
    b-field(grouped multiline-group position='is-centered')
      p.control(v-for='adder in adders')
        b-button(
          :key='adder.type'
          @click='addElement(adder.type)'
          :icon-left="adder.icon"
          round
        ) {{adder.tooltip}}
</template>
<script>
import { mapMutations } from 'vuex';

export default {
  data() {
    return {
      adders: [
        {
          tooltip: 'Text',
          icon: 'format-font',
          type: 'text',
        },
        {
          tooltip: 'GIF/pic/video',
          icon: 'image',
          type: 'asset',
        },
        {
          tooltip: 'Shape',
          icon: 'shape',
          type: 'shape',
        },
        {
          tooltip: 'From clipboard',
          icon: 'content-paste',
          type: 'clipboard',
        },
      ],
    };
  },
  methods: {
    ...mapMutations([
      'addElement',
    ]),
  },
};
</script>
<style lang="scss">
.element-adder {
  .adder-button {
    margin-top: 1em;
    text-align: left;
    display: block;
    background: none;
  }
  .icon-container {
    height: 10px;
  }
}
</style>
