<template lang="pug">
  el-select(v-model='font' allow-create filterable size='mini')
    el-option(v-for='possibleFont in possibleFonts',
              :key='possibleFont', :value='possibleFont')
      span(:style="fontStyle(possibleFont)") {{ possibleFont }}
</template>

<script>
export default {
  props: {
    value: {default: 'Impact'}
  },
  data () {
    return {
      font: this.value,
      possibleFonts: [
        'Impact',
        'Cabin Sketch',
        'Permanent Marker'
      ]
    }
  },
  mounted () {
    var self = this
    // let webfontsScript = document.createElement('script')
    // webfontsScript.setAttribute('src', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.16/webfont.js')
    // document.head.appendChild(webfontsScript)
    setTimeout(function () {
      self.loadFont(self.font)
    }, 1000)
  },
  methods: {
    loadFont (font) {
      console.log(`loading ${font}...`)
      console.log(window.WebFont)
      window.WebFont.load({google: {families: [font]}})
    },
    fontStyle (font) {
      return `float: left; font-family: '${font}', 'Raleway' !important;`
    }
  },
  watch: {
    font (val) {
      this.loadFont(val)
      this.$emit('input', val)
    }
  }
}
</script>
