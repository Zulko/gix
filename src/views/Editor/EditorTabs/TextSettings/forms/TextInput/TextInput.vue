<template lang="pug">
.element-text-input
  b-field
    b-input.element-input(
      type="textarea",
      :rows="textRows",
      autosize,
      :value="element.text",
      @input="(val) => updateElement({ text: val })",
      :style="fontStyle"
    )
</template>

<script>
import ElementComponentMixin from '../../../ElementComponentMixin.vue';

export default {
  extends: ElementComponentMixin,
  computed: {
    fontStyle() {
      return {
        'font-family': `${this.element.font.family}, Arial !important`,
        'font-weight': this.element.font.bold ? 'bold' : 'normal',
        'text-align': this.element.xAlign,
      };
    },
    textRows() {
      return Math.max(1, this.element.text.split(/\r\n|\r|\n/).length);
    },

  },
};
</script>

<style lang='scss'>
.element-text-input {
  position: relative;

  textarea {
    margin-top: 10px;
    font-size: 20px;
    font-weight: inherit;
    font-family: inherit;
    text-align: inherit;
    resize: none;
  }
}
</style>
