<template lang="pug">
svg.svg-composition(
      :width="sourceWidth", :height="sourceHeight"
      :viewbox="`0 0 ${sourceWidth} ${sourceHeight}`",
      xmlns="http://www.w3.org/2000/svg",
      :style="videoSizeCSS")
      svg-element(v-for='element in elements', :key='element.id',
                  :element='element', :currentTime='currentTime')

</template>
<script>
import tools from '../../tools'
export default {
  props: {
    elements: {default: ([])},
    widht
  },
  data: {
    svgElement
  }
  mounted () {
    this.svgElement = this.$element.getElementsByTagName('svg')[0]
  },
  watch: {
    elements: {
      deep: true,
      handler () {
        this.$emit('@input', inlinedSVG)
      }
    }
  }
}
</script>
