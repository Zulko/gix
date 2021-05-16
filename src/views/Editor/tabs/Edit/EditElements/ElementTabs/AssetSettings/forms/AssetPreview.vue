<template lang="pug">
.asset-preview
  img(
    v-if="element.subtype === 'image' || element.subtype === 'gif'",
    :src="element.url"
  )
  video(v-if="element.subtype === 'video'", :src="element.mediaUrl")

  p.asset-infos(v-if="assetInfos")
    span(v-if="element.title") #[b {{ element.title }}]
    br
    span {{ assetInfos.width }}x{{ assetInfos.height }}
    span(v-if="assetInfos.duration")
    | , {{ Math.round(assetInfos.duration) }}s @{{ Math.round(assetInfos.fps) }}fps
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
  max-width: 500px;
  margin: 0 auto;
  .media-title {
    font-size: 1.2em;
    text-align: center;
  }
  img {
    resize: both;
    overflow: auto;
    margin: 0 auto;
    max-height: 100px;
    display: block;
  }
  .asset-infos {
    text-align: center;
    font-size: 1em;
    margin-bottom: 0;
  }
}
</style>
