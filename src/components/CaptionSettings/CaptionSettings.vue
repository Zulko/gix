<template lang="pug">
.caption-settings
  el-tooltip(content='Toggle options' placement="right")
    .options-toggle
      el-button(circle @click='showToolbar = !showToolbar')
        icon(name='sliders-h' scale="1.1")
  el-card
    span(slot='header')
      caption-toolbar(:caption='caption')
    caption-text-input(:caption='caption')

    transition(enter-active-class='animated flipInX fast')
      el-tabs(@tab-click='tabClick' v-show='showToolbar')
        el-tab-pane
          span(slot='label')
            el-tooltip(content='Text position')
              icon(name='map-pin')
          h4.property-title Text position
          caption-position-form(:caption='caption')

        el-tab-pane
          span(slot='label')
            el-tooltip(content='Colors')
              icon(name='palette')
          h4.property-title Text and stroke colors
          caption-color-form(:caption='caption')

        el-tab-pane
          span(slot='label')
            el-tooltip(content='Text font')
              icon(name='font')
          h4.property-title Text font
          caption-font-form(:caption='caption')

        el-tab-pane
          span(slot='label')
            el-tooltip(content='Time segment')
              icon(name='hourglass-half')
          h4.property-title Time segment
          caption-time-segment-form(:caption='caption')

        el-tab-pane(label='animation')
          span(slot='label')
            el-tooltip(content='Animations')
              icon(name='film')
          h4.property-title Animations
          caption-animation-form(:caption='caption')
</template>

<script>
export default {
  extends: require('./CaptionComponent.vue').default,
  data () {
    return {
      showToolbar: false
    }
  },
  methods: {
    tabClick (tab) {
      if (tab.label === 'animation') {
        this.$notifyOnce('animation-warning', {
          message: 'Animated captions may not find a font family if it is not installed on your machine.'
        })
      }
    }
  },
  components: {
    'caption-toolbar': require('./widgets/CaptionToolbar').default,
    'caption-text-input': require('./widgets/CaptionTextInput/CaptionTextInput').default,
    'caption-position-form': require('./widgets/CaptionPositionForm').default,
    'caption-font-form': require('./widgets/CaptionFontForm').default,
    'caption-color-form': require('./widgets/CaptionColorForm').default,
    'caption-animation-form': require('./widgets/CaptionAnimationForm/CaptionAnimationForm.vue').default,
    'caption-time-segment-form': require('./widgets/CaptionTimeSegmentForm.vue').default
  }
}
</script>
<style lang='scss'>
.caption-settings {
  position: relative;
  display: block;
  margin-bottom: 3em !important;
  // background-color: #fffdff;
  .options-toggle {
    position: absolute;
    margin-top: -12px;
    z-index: 10000;
    button  {
      span {
        padding-left: .5px !important;
        padding-right: .5px !important;
      }
    }
  }
  .el-card {
    margin-left: 12px;
    margin-right: 12px;
  }
  .el-card__header {
     background-color: #bdddfc !important;
     padding: 1mm !important;
  }
  .el-card__body {
    padding: 1mm 4mm 4mm 4mm;
  }
  .el-tabs__content {
    padding: 0em 0.8em 0em 0.8em !important;
  }
  .property-title {
    font-weight: bold;
    text-transform: capitalize;
    color: gray;
    margin: 0 0 0.5em 0;
    text-align: center;
  }
  .el-input-number.is-controls-right .el-input__inner {
    padding-left: 2px;
     padding-right: 30px;
  }
}
</style>
