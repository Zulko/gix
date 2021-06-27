<template lang="pug">
b-field.rotation-form(label="Angle", label-position="on-border")
  b-numberinput.numberinput(
    size="is-small",
    controls-position="compact",
    :value="value",
    @input="(v) => $emit('update', v % 360)"
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
.rotation-form {
  .numberinput {
    width: 120px;
  }
}
</style>
