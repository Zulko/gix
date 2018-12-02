<template lang="pug">
.home-features
  h2 GIF / SHARE / REMIX
  el-row.home-features(type='flex', :gutter='80')
    el-col(:xs='12', :sm='8', v-for='feature in features',
           :key='feature.title')
      el-row
        el-col(:xs='24', :sm='6')
          img.feature-icon(:src='`/static/img/icons/${feature.icon}`')
        el-col(:xs='24', :sm='18')
          .feature-text
            .feature-title {{feature.title}}
            .feature-description {{feature.description}}
</template>

<script>
export default {
  data () {
    return {
      features: [
        {
          title: 'GIF-making with an edge',
          icon: 'software_pen.svg',
          description: 'Advanced editing, 100s of fonts, animations, and more.'
        },
        {
          title: 'Free + decentralized',
          icon: 'basic_paperplane.svg',
          description: 'No servers, no accounts. It simply runs in your browser.'
        },
        {
          title: 'Social',
          icon: 'basic_share.svg',
          description: 'Share your projects online, let others build on top.'
        }
      ]
    }
  }
}
</script>

<style lang='scss' scoped>
.home-features {
  .feature-icon {
    display: block;
    width: 50px;
    max-width: 90%;
    margin: 0 auto 1em;
  }
  .feature-text {
    .feature-title {
      font-family: 'Permanent Marker';
      margin-bottom: 0.2em;
    }
  }
}
</style>
