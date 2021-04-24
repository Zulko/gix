<template lang="pug">
.element-color-form
  b-field(grouped, multiline-group)
    b-field(label='Fill')
      color-picker(
        :value='element.color',
        @input='(v) => updateElement({ color: v.hex8 })'
      )

    b-field(label='Stroke')
      color-picker(
        :value='element.stroke.color',
        @input='(v) => updateElement({ stroke: { color: v } })'
      )
      b-field(label='Width', label-position='on-border')
        b-numberinput.number-input(
          controls-position='compact',
          :value='element.stroke.width',
          @input='(v) => updateElement({ stroke: { width: v } })',
          :min='0',
          :step='0.1'
        )
    b-field(label='Outline', v-if='element.outline')
      color-picker(
        :value='element.outline.color',
        @input='(v) => updateElement({ outline: { color: v } })'
      )
      b-field(
        label='Width',
        v-if='element.outline',
        label-position='on-border'
      )
        b-numberinput.number-input(
          controls-position='compact',
          :value='element.outline.width',
          @input='(v) => updateElement({ outline: { width: v } })',
          :min='0',
          :step='0.1'
        )
</template>

<script>
import ColorPicker from '../../../../../../../components/widgets/ColorPicker.vue';
import ElementComponentMixin from '../ElementComponentMixin.vue';

export default {
  extends: ElementComponentMixin,
  data() {
    return {
      isActive: false,
    };
  },
  components: {
    'color-picker': ColorPicker,
  },
};
</script>

<style lang='scss'>
.element-color-form {
  .number-input {
    width: 140px !important;
  }
}
</style>
