<template lang="pug">
.share-project-form
  //- .gix-preview
  //-   gix-animation(:project='this.$store.state.project')

  .share-form
    b-input(v-model='title', size='small')
  p
    b-button(size='mini', @click='downloadProjectJson') Save project in your browser
  p
    b-button(size='mini', @click='downloadProjectJson') Download Project as JSON file
  p
    b-button(size='mini', @click='createDirectLink') Create a web link for sharing
  .web-link-fields(v-if='url')
    p Created a {{ url.length }}-character link.<br/>Copy to clipboard as:

    p.clipboard-link(
      v-for='mode in urlModes',
      :key='mode',
      @click='copyUrlToClipboard(mode)'
    ) {{ mode }}
</template>

<script>
// import GixAnimation from '@/components/GixAnimation/GixAnimation.vue';
import downloadjs from 'downloadjs';
import pako from 'pako';
import { mapMutations } from 'vuex';
import tools from '../../../clipboard_tools';

export default {
  data() {
    return {
      url: null,
      urlModes: ['URL', 'Markdown'],
    };
  },
  computed: {
    title: {
      get() {
        if (this.$store.state.project.infos) {
          return this.$store.state.project.infos.title;
        }
        return 1;
      },
      set(value) {
        this.$store.commit('updateProject', { infos: { title: value } });
      },
    },
  },
  components: {
    // 'gix-animation': GixAnimation,
  },
  methods: {
    ...mapMutations(['updateProject']),
    downloadProjectJson() {
      const { project } = this.$store.state;
      const projectJSON = JSON.stringify(project, null, 2);
      downloadjs(projectJSON, `${project.infos.title}.json`, 'application/json');
    },
    async createDirectLink() {
      const { project } = this.$store.state;
      const compressed = pako.deflate(JSON.stringify(project), { to: 'string' });
      this.url = `https://gix.it?data=${btoa(compressed)}`;
    },
    copyUrlToClipboard(mode) {
      const links = {
        URL: this.url,
        Markdown: `[${this.$store.state.project.infos.title}](${this.url})`,
      };
      tools.copyStrToClipboard(links[mode]);
      this.$notify({
        duration: 3000,
        title: 'Copied',
        message: `The ${mode} has been copied to your clipboard`,
      });
    },
  },
};
</script>

<style lang='scss'>
.share-project-form {
  text-align: center;
  .clipboard-link {
    color: #0e84ffff;
    cursor: pointer;
  }
}
</style>
