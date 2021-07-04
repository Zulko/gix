<template lang="pug">
.element-text-input
  b-field
    b-input.element-input(
      type="textarea",
      :rows="textRows",
      size="is-small",
      :value="value",
      @input="(val) => $emit('update', val)",
      :style="fontStyle"
    )
    b-button(
      icon-right="emoticon-neutral-outline",
      @click="dialogVisible = true"
    )
  b-modal(
    v-model="dialogVisible",
    has-modal-card,
    trap-focus,
    :destroy-on-hide="false",
    aria-role="dialog",
    aria-modal
  )
    form(action="")
      .modal-card(
        style="width: 800px; max-width: 90%; background-color: white"
      )
        header.modal-card-head
          p.modal-card-title(style="font-family: 'Caveat Brush'") Add a new Emoji
        emoji-picker(
          @pick="(e) => { $emit('update', element.text + e); dialogVisible = false; }"
        )
</template>

<script>
import EmojiPicker from './EmojiPicker.vue';

export default {
  props: {
    value: { type: String },
    element: { type: Object },
  },
  data() {
    return {
      dialogVisible: false,
    };
  },
  computed: {
    fontStyle() {
      return {
        'font-family': `${this.element.font.family}, Arial !important`,
        'font-weight': this.element.font.bold ? 'bold' : 'normal',
        'text-align': this.element.xAlign,
      };
    },
    textRows() {
      return Math.max(1, this.value.split(/\r\n|\r|\n/).length);
    },
  },
  components: {
    'emoji-picker': EmojiPicker,
  },
};
</script>

<style lang='scss'>
.element-text-input {
  position: relative;
  width: 100%;
  textarea.textarea {
    font-size: 18px;
    font-weight: inherit;
    font-family: inherit;
    text-align: inherit;
    resize: none;
    width: 100%;
    min-width: 50%;
  }
  .element-input {
    display: inline-block;
    width: 100%;
  }
  .button {
    display: inline-block;
    margin-top: 0em;
    border: none;
    font-size: 1.5em;
    background: none;
  }
}
</style>
