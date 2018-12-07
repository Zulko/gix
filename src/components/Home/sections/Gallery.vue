<template lang="pug">
.home-gallery
  h2 Start on an example
  gix-animations-carousel(:projects='projects' @click='handleClick')
</template>

<script>
import GixAnimationsCarousel from '../../widgets/GixAnimationsCarousel'
export default {
  components: {
    'gix-animations-carousel': GixAnimationsCarousel
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
