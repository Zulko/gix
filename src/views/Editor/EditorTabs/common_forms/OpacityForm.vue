<template lang="pug">
b-field.opacity-form(grouped, label="Opacity (%)", label-position="on-border")
  b-numberinput.number-input(
    size="is-small",
    controls-position="compact",
    :value="100 * value",
    @input="(v) => $emit('update', v / 100)",
    :min="0",
    :max="100",
    :step="1"
  )
</template>

<script>
export default {
  props: {
    value: { type: Number },
  },
};
</script>

<style lang='scss'>
.opacity-form {
  .number-input {
    width: 140px !important;
  }
}
</style>
