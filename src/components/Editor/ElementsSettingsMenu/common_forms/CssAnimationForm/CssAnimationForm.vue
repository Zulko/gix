<template lang="pug">
.element-animation-form
  .inline-setting-text
    icon(name='sign-in-alt')
  css-animation-selector(:value='element.animation.in'
                         @input='val => updateElement({animation: {in: val}})'
                         category='entrances')
  br
  .inline-setting-text
    icon(name='infinity')
  animation-selector(v-model='element.animation.loop', category='loops')
  br
  .inline-setting-text
    icon(name='infinity')
  animation-selector(v-model='element.animation.out', category='exits')
</template>

<script>
export default {
  extends: require('../../ElementComponentMixin.vue').default,
  components: {
    'css-animation-selector': require('./CssAnimationSelector.vue').default
  }
}
</script>

<style lang='scss'>
</style>
