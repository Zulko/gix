<template lang="pug">
b-field.opacity-form(grouped, label="Opacity (%)")
  p.control
    b-numberinput.number-input(
      controls-position="compact",
      :value="parseInt(100 * element.opacity)",
      @input="(v) => updateElement({ opacity: v / 100 })",
      :min="0",
      :max="100",
      :step="1"
    )
</template>

<script>
import ElementComponentMixin from '../ElementComponentMixin.vue';

export default {
  props: {
    element: { type: Object },
  },
  extends: ElementComponentMixin,
};
</script>

<style lang='scss'>
.opacity-form {
  .number-input {
    width: 140px !important;
  }
}
</style>
