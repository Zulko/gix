<template lang="pug">
.element-settings
  slot
</template>

<script>
import ElementComponentMixin from './ElementComponentMixin.vue';

export default {
  extends: ElementComponentMixin,
  props: {
    showOptions: { default: true, type: Boolean },
  },
  data() {
    return {
      showToolbar: false,
    };
  },
  methods: {
    tabClick(tab) {
      if (tab.label === 'animation') {
        this.$notifyOnce('animation-warning', {
          message: 'Animated elements may not find a font family if it is not installed on your machine.',
        });
      }
    },
  },
};
</script>
<style lang='scss'>
.element-settings {
  position: relative;
  display: block;
  margin-bottom: 3em !important;
  // background-color: #fffdff;
}
</style>
