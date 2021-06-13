<template lang="pug">
b-modal(
  v-model="dialogVisible",
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
  props: {
    value: { type: Boolean },
  },
  data() {
    return {
      dialogVisible: this.value,
    };
  },
  watch: {
    dialogVisible(val) {
      this.$emit('input', val);
    },
    value(val) {
      this.dialogVisible = val;
    },
  },
  components: {
    'file-or-url-form': FileOrUrlFormVue,
  },
  methods: {
    ...mapMutations(['addElement']),
    async addAsset(url) {
      this.$emit('closeMenu');
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
