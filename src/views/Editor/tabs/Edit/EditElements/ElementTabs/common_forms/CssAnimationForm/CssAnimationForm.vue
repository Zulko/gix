<template lang="pug">
.element-animation-form
  .inline-setting-text
    icon(name='sign-in-alt')
  css-animation-selector(:value='element.cssAnimation.in'
                         @input='val => updateElement({cssAnimation: {in: val}})'
                         category='entrances')
  br
  .inline-setting-text
    icon(name='infinity')
  css-animation-selector(:value='element.cssAnimation.loop',
                         @input='val => updateElement({cssAnimation: {loop: val}})',
                         category='loops')
  br
  .inline-setting-text
    icon(name='sign-out-alt')
  css-animation-selector(:value='element.cssAnimation.out',
                         @input='val => updateElement({cssAnimation: {out: val}})',
                         category='exits')
</template>

<script>
export default {
  extends: require('../../ElementComponentMixin.vue').default,
  components: {
    'css-animation-selector': require('./CssAnimationSelector.vue').default,
  },
};
</script>

<style lang='scss'>
</style>
