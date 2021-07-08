<template lang="pug">
section.element-color-form
  b-field(label="Color", horizontal)
    color-picker(
      :value="element.color",
      @input="(v) => updateElement({ color: v.hex8 })"
    )
  b-field(label="Outline", v-if="element.outline", horizontal)
    b-field(grouped)
      color-picker(
        :value="element.outline.color",
        @input="(v) => updateElement({ outline: { color: v.hex8 } })"
      )
      b-field(
        label="Width (%)",
        v-if="element.outline",
        label-position="on-border"
      )
        b-numberinput.number-input(
          controls-position="compact",
          :value="element.outline.width_percent",
          @input="(v) => updateElement({ outline: { width: v } })",
          :min="0",
          :step="1",
          size="is-small"
        )
  b-field(label="Stroke", horizontal)
    b-field(grouped)
      color-picker(
        :value="element.stroke.color",
        @input="(v) => updateElement({ stroke: { color: v.hex8 } })"
      )
      b-field(label="Width (%)", label-position="on-border")
        b-numberinput.number-input(
          controls-position="compact",
          :value="element.stroke.width_percent",
          @input="(v) => updateElement({ stroke: { width: v } })",
          :min="0",
          :step="1",
          size="is-small"
        )

  possibly-time-varying-form(
    label="Opacity",
    :element="element",
    field="opacity",
    :valueForm="OpacityForm",
    :allowModifiers="true"
  )
</template>

<script>
import ColorPicker from '../../../../components/widgets/ColorPicker.vue';
import OpacityForm from './OpacityForm.vue';
import ElementComponentMixin from '../ElementComponentMixin.vue';
import PossiblyTimeVaryingForm from './PossiblyTimeVaryingForm.vue';

export default {
  extends: ElementComponentMixin,
  data() {
    return {
      isActive: false,
      OpacityForm,
    };
  },
  components: {
    'color-picker': ColorPicker,
    'possibly-time-varying-form': PossiblyTimeVaryingForm,
  },
};
</script>

<style lang='scss'>
.element-color-form {
  .number-input {
    width: 120px !important;
  }
}
</style>
