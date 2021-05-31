<template lang="pug">
.element-adder
  section.section
    .buttons(style="width: 300px; margin: 0 auto")
      b-button.is-fullwidth(
        v-for="adder in adders",
        :key="adder.type",
        @click="addElement(adder.type)",
        :icon-left="adder.icon",
        round
      ) New {{ adder.tooltip }}
</template>
<script>
import { mapMutations } from 'vuex';

export default {
  data() {
    return {
      adders: [
        {
          tooltip: 'text',
          icon: 'format-font',
          type: 'text',
        },
        {
          tooltip: 'GIF/pic/video',
          icon: 'image',
          type: 'asset',
        },
        {
          tooltip: 'rectangle',
          icon: 'rectangle-outline',
          type: 'rectangle',
        },
        {
          tooltip: 'pasted from clipboard',
          icon: 'content-paste',
          type: 'clipboard',
        },
      ],
    };
  },
  methods: {
    ...mapMutations(['addElement']),
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
