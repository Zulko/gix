<template lang="pug">
.edit-elements
    element-tabs
</template>
<script>
import ElementTabs from './ElementTabs/ElementTabs.vue';

export default {
  components: {
    'element-tabs': ElementTabs,
  },
};
</script>
<style lang="scss">
.edit-elements {
  margin: 0 auto;
  width: 90%;
}
</style>
