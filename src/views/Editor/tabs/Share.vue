<template lang="pug">
.share-project-form
  .share-form(style='width: 60%; margin: 1cm auto;')
    b-field(label='Project title', label-position='on-border')
      b-input(v-model='title', size='small')
    b-field(label='Project tags', label-position='on-border')
      b-taginput(
        v-model='tags',
        :data='filteredInputTags',
        :autocomplete='true',
        :allow-new='true',
        :open-on-focus='true',
        icon='label',
        placeholder='tags',
      )
    .buttons
      b-button.is-fullwidth(@click='downloadProjectJson') Save project in your browser
      b-button.is-fullwidth(@click='downloadProjectJson') Download Project as JSON file
      b-button.is-fullwidth(@click='createDirectLink').
        {{ urls ? 'Update' :  'Create' }} web sharing link
    .web-link-fields(v-if='urls')
      p Created a {{ urls.URL.length }}-character link.
      b-field(
        v-for='(url, mode) in urls'
        :label='`${mode} (${url.length} characters)`',
        label-position='on-border')
        b-input(expanded :value='url' disabled)
        p(class="control")
          span.button(@click='copyUrlToClipboard(mode)') Copy
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
      urls: null,
      filteredInputTags: [],
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
    tags: {
      get() {
        if (this.$store.state.project.infos) {
          return this.$store.state.project.infos.tags;
        }
        return 1;
      },
      set(value) {
        this.$store.commit('updateProject', { infos: { tags: value } });
      },
    },
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
      const baseUrl = window.location.href.split('?')[0];
      const url = `${baseUrl}?data=${btoa(compressed)}`;
      this.urls = {
        URL: url,
        Markdown: `[${this.$store.state.project.infos.title}](${url})`,
      };
    },
    copyUrlToClipboard(mode) {
      tools.copyStrToClipboard(this.urls[mode]);
      this.$buefy.toast.open({
        message: `${mode} copied to clipboard`,
        type: 'is-success',
      });
    },
  },
  watch: {

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
