<template lang="pug">
b-field.position-xy-form(grouped)
  p.control
    b-field(label="X", label-position="on-border")
      b-numberinput.numberinput(
        size="is-small",
        controls-position="compact",
        :value="value.x",
        @input="(v) => $emit('update', { x: v, y: value.y })"
      )
  p.control
    b-field(label="Y", label-position="on-border")
      b-numberinput.numberinput(
        size="is-small",
        controls-position="compact",
        :value="value.y",
        @input="(v) => $emit('update', { x: value.x, y: v })"
      )
</template>
<script>
export default {
  props: {
    value: { type: Object },
  },
};
</script>
<style lang='scss'>
.position-xy-form {
  .numberinput {
    width: 120px;
  }
}
</style>
