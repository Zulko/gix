<template lang="pug">
.asset-preview
  img(v-if="element.subtype === 'image' || element.subtype === 'gif'"
      :src='element.url')
</template>
<script>
export default {
  extends: require('../ElementComponentMixin.vue').default
}
</script>
<style lang='scss'>
.asset-preview {
  margin-bottom: 1em;
  img {
    resize: both;
    overflow: auto;
    margin: 0 auto;
    max-height: 100px;
    display: block;
  }
}
</style>
