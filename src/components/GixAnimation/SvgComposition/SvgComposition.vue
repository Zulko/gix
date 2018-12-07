<template lang="pug">
svg.svg-composition(
      :width="svgWidth", :height="svgHeight"
      :viewbox="`0 0 ${svgWidth} ${svgHeight}`",
      xmlns="http://www.w3.org/2000/svg",
      :style="style")
      svg-element(v-for='element in svgElements', :key='element.id',
                  :element='element', :currentTime='currentTime')
</template>
<script>
import { cloneWithInlineStyle } from './inlineSvgStyles'
import SvgElement from './SvgElement/SvgElement'
export default {
  props: {
    inlineStyles: {default: true},
    svgElements: {default: ([])},
    svgWidth: {default: 100},
    svgHeight: {default: 100}
  },
  mounted () {
    this.svgDomElement = this.$el.getElementsByTagName('svg')[0]
  },
  watch: {
    elements: {
      deep: true,
      handler () {
        var svgElement
        if (this.inlineStyles) {
          svgElement = cloneWithInlineStyle(this.svgDomElement)
        } else {
          svgElement = this.svgDomElement
        }
        var svg = new XMLSerializer().serializeToString(svgElement)
        this.$emit('@input', svg)
      }
    }
  },
  computed: {
    style () {
      return {
        width: this.svgWidth + 'px',
        height: this.svgHeight + 'px'
      }
    }
  },
  components: {
    'svg-element': SvgElement
  }
}
</script>
