<template lang="pug">
b-numberinput.font-size-form.input-number(
  size="is-small",
  :value="value",
  @input="(v) => $emit('update', v)",
  controls-position="compact"
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
.font-size-form {
  .numberinput {
    width: 120px;
  }
}
</style>
