<template lang="pug">
section.element-font-form
  b-field(label="Font", horizontal)
    font-picker(
      :value="element.font.family",
      @input="(val) => updateElement({ font: { family: val } })"
    )

  b-field(label="Line height", horizontal)
    b-numberinput.input-number(
      size="is-small",
      :min="0",
      controls-position="compact",
      :step="0.05",
      :value="element.font.lineHeight",
      @input="(v) => updateElement({ font: { lineHeight: v } })"
    )
  b-field(label="Bold", horizontal)
    b-switch(
      size="mini",
      :value="element.font.bold",
      @input="(val) => updateElement({ font: { bold: val } })"
    )
  possibly-time-varying-form(
    label="Font size",
    :element="element",
    field="fontSize",
    :valueForm="FontSizeForm",
    :allowModifiers="true"
  )
</template>

<script>
import ElementComponentMixin from '../../../ElementComponentMixin.vue';
import FontPicker from './FontPicker.vue';
import FontSizeForm from './FontSizeForm.vue';
import PossiblyTimeVaryingForm from '../../../common_forms/PossiblyTimeVaryingForm.vue';

export default {
  extends: ElementComponentMixin,
  data() {
    return { FontSizeForm };
  },
  components: {
    'font-picker': FontPicker,
    'possibly-time-varying-form': PossiblyTimeVaryingForm,
  },
};
</script>
<style lang="scss">
.input-number {
  width: 120px;
}
</style>
