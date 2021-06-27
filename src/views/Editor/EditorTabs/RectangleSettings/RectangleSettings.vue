<template lang="pug">
.rectangle-settings
  b-tabs(type="is-boxed", :animated="false")
    b-tab-item(label="Position")
      position-form(:element="element")
    b-tab-item(label="Size")
      resize-form(:element="element")
      br
      b-field(grouped, group-multiline, label="Rounded corners")
        p.control
          b-field(label="Width", label-position="on-border")
            b-numberinput.number-input(
              size="mini",
              controls-position="compact",
              :min="0",
              :value="element.roundedCorners.rx",
              @input="(v) => updateElement({ roundedCorners: { rx: v } })"
            )
        p.control
          b-field(label="Height", label-position="on-border")
            b-numberinput.number-input(
              controls-position="compact",
              size="mini",
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
import ResizeForm from '../AssetSettings/forms/ResizeForm.vue';

export default {
  extends: ElementComponentMixin,
  data() {
    return {
      subtype: 'bla',
    };
  },
  components: {
    'element-settings': ElementsSettings,
    'position-form': PositionForm,
    'resize-form': ResizeForm,
    'color-form': ColorForm,
  },
};
</script>
<style lang="scss">
.rectangle-settings {
  .number-input {
    width: 150px;
  }
}
</style>
