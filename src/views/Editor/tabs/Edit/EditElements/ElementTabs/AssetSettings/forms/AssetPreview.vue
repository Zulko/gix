<template lang="pug">
.asset-preview
  img(v-if="element.subtype === 'image' || element.subtype === 'gif'"
      :src='element.url')
  p.asset-infos(v-if='assetInfos')
    span {{assetInfos.width}}x{{assetInfos.height}}
    span(v-if='assetInfos.duration')
    |, {{Math.round(assetInfos.duration)}}s @{{Math.round(assetInfos.fps)}}fps
</template>
<script>
export default {
  props: {
    element: { type: Object, default: () => ({}) },
    assetInfos: { type: Object, default: null },
  },
};
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
