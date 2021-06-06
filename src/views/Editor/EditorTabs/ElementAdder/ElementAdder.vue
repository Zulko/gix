<template lang="pug">
.element-adder
  section.section
    .buttons(style="width: 300px; margin: 0 auto")
      b-button.is-fullwidth(@click="addText", icon-left="format-font", round) New text
      b-button.is-fullwidth(
        @click="dialogIsVisible = true",
        icon-left="image",
        round
      ) New GIF/pic/video
      b-button.is-fullwidth(
        @click="addRectangle",
        icon-left="rectangle-outline",
        round
      ) New rectangle
  b-modal(
    v-model="dialogIsVisible",
    has-modal-card,
    trap-focus,
    :destroy-on-hide="false",
    aria-role="dialog",
    aria-modal
  )
    form(action="")
      .modal-card(style="width: auto")
        header.modal-card-head
          p.modal-card-title(style="font-family: 'Caveat Brush'") Add a new GIF/Picture/Video
        section.modal-card-body
          file-or-url-form(
            label="GIF/Image/Video URL or file",
            @urlInput="addAsset",
            @fileInput="handleFileInput"
          )
</template>
<script>
import { mapMutations } from 'vuex';
import FileOrUrlFormVue from '../../../../components/widgets/FileOrUrlForm.vue';
import elementGenerators from './elementsGenerators';

export default {
  data() {
    return {
      dialogIsVisible: false,
    };
  },
  components: {
    'file-or-url-form': FileOrUrlFormVue,
  },
  methods: {
    ...mapMutations(['addElement']),
    addText() {
      this.addElement(elementGenerators.newText(this.$store.state.project));
    },
    addRectangle() {
      this.addElement(elementGenerators.newRectangle(this.$store.state.project));
    },
    async addAsset(url) {
      try {
        const newAsset = await elementGenerators.newAsset(url, this.$store.state.project);
        this.addElement(newAsset);
      } catch (err) {
        console.error(err);
        this.$buefy.toast.open({
          message: 'Something wrong happened. Check the URL and try again',
          type: 'is-danger',
        });
      }
    },
    async handleFileInput() { return null; },
  },

};
</script>
<style lang="scss">
.element-adder {
  .adder-button {
    margin-top: 1em;
    text-align: left;
    display: block;
    background: none;
  }
  .icon-container {
    height: 10px;
  }
}
</style>
