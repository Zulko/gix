<template lang="pug">
element-settings.text-element-settings
  .main(slot='alwaysVisible')
    text-input(:element='element')

  .tabs(slot='tabs')
    pane(icon='map-pin', title='Text position')
      position-form(slot='content', :element='element')

    pane(icon='palette', title='Color')
      color-form(slot='content', :element='element')

    pane(icon='font', title='Text font')
      font-form(slot='content', :element='element')

    pane(icon='hourglass-half', title='Time segment')
      time-segment-form(slot='content', :element='element')

    pane(icon='film', title='Animations')
      animation-form(slot='content', :element='element')
</template>

<script>
export default {
  extends: require('../ElementComponentMixin.vue').default,
  components: {
    'pane': require('../SettingsTabPane.vue').default,
    'element-settings': require('../ElementSettings.vue').default,
    'position-form': require('../common_forms/PositionForm').default,
    'text-input': require('./forms/TextInput/TextInput').default,
    'font-form': require('./forms/FontForm/FontForm').default,
    'color-form': require('../common_forms/ColorForm').default,
    'animation-form': require('../common_forms/CssAnimationForm/CssAnimationForm.vue').default,
    'time-segment-form': require('../common_forms/TimeSegmentForm.vue').default
  }
}
</script>
