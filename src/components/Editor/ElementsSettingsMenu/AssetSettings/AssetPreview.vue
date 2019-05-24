<template lang="pug">
.asset-preview
  img(v-if="element.subtype === 'image' || element.subtype === 'gif'"
      :src='element.url')
  p.asset-infos(v-if='infos')
    span {{infos.width}}x{{infos.height}}
    span(v-if='infos.duration') , {{Math.round(infos.duration)}}s @{{Math.round(infos.fps)}}fps
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
  .asset-infos {
    text-align: center;
    font-size:0.8em;
    margin-bottom: 0;
  }
}
</style>
