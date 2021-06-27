<template lang="pug">
.element-font-form
  b-field(grouped, group-multiline)
    b-field(label="Font")
      font-picker(
        :value="element.font.family",
        @input="(val) => updateElement({ font: { family: val } })"
      )
    b-field(label="Line height")
      b-numberinput.input-number(
        size="is-small",
        :min="0",
        controls-position="compact",
        :step="0.05",
        :value="element.font.lineHeight",
        @input="(v) => updateElement({ font: { lineHeight: v } })"
      )
    b-field(label="Bold")
      b-switch(
        size="mini",
        :value="element.font.bold",
        @input="(val) => updateElement({ font: { bold: val } })"
      )
  p(style="font-size: 0.8em; margin-top: 1em").
    You can pick any font on Google Fonts (
    #[a(href="https://fonts.google.com/", target="_blank") browse #[b-icon(icon="open-in-new", size="is-small")]])
  br
  b-field(label="Font size")
    possibly-time-varying-form(
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
