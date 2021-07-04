<template lang='pug'>
b-tooltip.color-picker(
  position="is-bottom",
  type="is-light",
  :triggers="['click']",
  :auto-close="['outside', 'escape']"
)
  b-button.color-button(size="is-small")
    .color-zone(:style="{ backgroundColor: value }", size="is-small")
  chrome-color-picker(
    slot="content",
    :value="value",
    @input="(v) => $emit('input', v)"
  )
</template>
<script>
import { Chrome } from 'vue-color';

export default {
  props: {
    value: { type: String, default: '#000000' },
  },
  data() {
    return {
      isActive: false,
    };
  },
  components: {
    'chrome-color-picker': Chrome,
  },
};
</script>
<style lang='scss'>
.color-picker {
  .color-button {
    padding: 0.5em !important;
    .color-zone {
      width: 1em;
      height: 1em;
      border: 1px solid grey;
    }
  }
}
</style>
