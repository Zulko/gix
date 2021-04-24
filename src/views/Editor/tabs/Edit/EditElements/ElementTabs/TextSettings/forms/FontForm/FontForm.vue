<template lang="pug">
.element-font-form
  b-field(grouped group-multiline)
    b-field(label='Font')
      font-picker(:value='element.font.family'
                  @input='val => updateElement({font: {family: val}})')
    b-field(label='Font size')
      b-numberinput.input-number(
        :value='element.font.size'
        @input='val => updateElement({font: {size: val}})'
        controls-position="compact"
      )
    b-field(label='Line height')
      b-numberinput.input-number(
        :min='0',
        controls-position="compact"
        :step='0.05',
        :value='element.font.lineHeight'
        @input='v => updateElement({font: {lineHeight: v}})')
    b-field(label='Bold')
      b-switch(size='mini',
                  :value='element.font.bold',
                  @input='val => updateElement({font: {bold: val}})')
</template>

<script>
import ElementComponentMixin from '../../../ElementComponentMixin.vue';
import FontPicker from './FontPicker.vue';

export default {
  extends: ElementComponentMixin,
  components: {
    'font-picker': FontPicker,
  },
};
</script>
<style lang="scss">
.input-number {
  width: 170px;
}
</style>
