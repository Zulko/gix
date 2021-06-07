<template lang="pug">
.element-adder
  section.section
    .buttons(style="width: 300px; margin: 0 auto")
      b-button.is-fullwidth(@click="addText()", icon-left="format-font", round) New text
      b-button.is-fullwidth(
        @click="dialogIsVisible = true",
        icon-left="image",
        round
      ) New GIF/pic/video
      b-button.is-fullwidth(
        @click="addRectangle()",
        icon-left="rectangle-outline",
        round
      ) New rectangle
      b-message(type="is-info", has-icon, style="margin-top: 1em").
        You can also add elements with a right-click on the Gix screen.
  asset-adding-modal(v-model="dialogIsVisible")
</template>
<script>
import ElementAdderMixin from './ElementAdderMixin';

export default {
  mixins: [ElementAdderMixin],
};
</script>
<style lang="scss">
.element-adder {
  .adder-button {
    margin-bottom: 1em;
    text-align: left;
    display: block;
    background: none;
  }
  .icon-container {
    height: 10px;
  }
}
</style>
