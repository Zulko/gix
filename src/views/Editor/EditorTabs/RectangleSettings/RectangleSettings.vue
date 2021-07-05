<template lang="pug">
section.rectangle-settings
  b-tabs(type="is-boxed", :animated="false")
    b-tab-item(label="Position")
      position-form(:element="element")
    b-tab-item(label="Size")
      possibly-time-varying-form(
        label="Size",
        :element="element",
        field="size",
        :valueForm="SizeForm",
        :allowModifiers="true"
      )
      b-field(horizontal, label="Rounded corners")
        b-field(grouped, group-multiline)
          p.control
            b-field(label="Width", label-position="on-border")
              b-numberinput.number-input(
                size="is-small",
                controls-position="compact",
                :min="0",
                :value="element.roundedCorners.rx",
                @input="(v) => updateElement({ roundedCorners: { rx: v } })"
              )
          p.control
            b-field(label="Height", label-position="on-border")
              b-numberinput.number-input(
                controls-position="compact",
                size="is-small",
                :min="0",
                :value="element.roundedCorners.ry",
                @input="(v) => updateElement({ roundedCorners: { ry: v } })"
              )
    b-tab-item(label="Color")
      color-form(:element="element")
</template>

<script>
import ElementComponentMixin from '../ElementComponentMixin.vue';
import ElementsSettings from '../ElementSettings.vue';
import PositionForm from '../common_forms/PositionForm/PositionForm.vue';
import ColorForm from '../common_forms/ColorForm.vue';
import SizeForm from '../AssetSettings/forms/SizeForm.vue';
import PossiblyTimeVaryingForm from '../common_forms/PossiblyTimeVaryingForm.vue';

export default {
  extends: ElementComponentMixin,
  data() {
    return {
      subtype: 'bla',
      SizeForm,
    };
  },
  components: {
    'element-settings': ElementsSettings,
    'position-form': PositionForm,
    'color-form': ColorForm,
    'possibly-time-varying-form': PossiblyTimeVaryingForm,
  },
};
</script>
<style lang="scss">
.rectangle-settings {
  .number-input {
    width: 120px;
  }
}
</style>
