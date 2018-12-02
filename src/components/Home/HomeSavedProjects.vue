<template lang="pug">
.home-saved-projects
  h2 Your saved projects
  captioned-frames-carousel(:projects='projects' @click='handleClick')
</template>

<script>
import CaptionedFramesCarousel from '../CaptionedFrames/CaptionedFramesCarousel'
export default {
  components: {
    'captioned-frames-carousel': CaptionedFramesCarousel
  },
  methods: {
    handleClick () {}
  },
  data () {
    return {
      projects: [
        {
          title: 'Project 1'
        },
        {
          title: 'Project 2'
        },
        {
          title: 'Project 3'
        }
      ]
    }
  }
}
</script>

<style lang='scss' scoped>
.home-gallery {
}
</style>
