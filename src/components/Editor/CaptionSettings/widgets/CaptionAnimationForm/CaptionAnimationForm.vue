<template lang="pug">
.caption-animation-form
  .inline-setting-text
    icon(name='sign-in-alt')
  animation-selector(:value='caption.animation.in'
                     @input='val => updateCaption({animation: {in: val}})'
                     category='entrances')
  br
  .inline-setting-text
    icon(name='infinity')
  animation-selector(v-model='caption.animation.loop', category='loops')
  br
  .inline-setting-text
    icon(name='infinity')
  animation-selector(v-model='caption.animation.out', category='exits')
</template>

<script>
export default {
  extends: require('../../CaptionComponent.vue').default,
  components: {
    'animation-selector': require('./AnimationSelector.vue').default
  }
}
</script>

<style lang='scss'>
</style>
