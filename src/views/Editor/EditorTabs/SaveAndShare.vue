<template lang="pug">
.share-project-form
  .share-form(style="width: 60%; margin: 1cm auto")
    b-field(label="Project title", label-position="on-border")
      b-input(v-model="title", size="small")
    b-field(label="Author", label-position="on-border")
      b-input(v-model="author", size="small")
    b-field(label="Project tags", label-position="on-border")
      b-taginput(
        v-model="tags",
        :data="tagsInSavedProjects",
        :autocomplete="true",
        :allow-new="true",
        :open-on-focus="true",
        icon="label",
        placeholder="tags"
      )
    .buttons
      b-button.is-fullwidth(@click="saveProjectAfterCheck", type="is-primary") Save in your browser
      b-button.is-fullwidth(@click="downloadProjectJson", type="is-primary") Download as JSON file
      b-button.is-fullwidth(@click="createDirectLink", type="is-primary").
        {{ urls ? 'Update' :  'Create' }} web sharing link
    .web-link-fields(v-if="urls")
      p Created a {{ urls.URL.length }}-character link.
      b-field(
        v-for="(url, mode) in urls",
        :key="url",
        :label="`${mode} (${url.length} characters)`",
        label-position="on-border"
      )
        b-input(expanded, :value="url", disabled)
        p.control
          span.button(@click="copyUrlToClipboard(mode)") Copy
</template>

<script>
// import GixAnimation from '@/components/GixAnimation/GixAnimation.vue';
import base64url from 'base64url';
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
    tagsInSavedProjects() {
      const allTags = Object.values(this.$store.state.savedProjects).reduce(
        (tags, p) => ([...tags, ...p.infos.tags]), [],
      );
      return [...new Set(allTags)];
    },
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
    author: {
      get() {
        if (this.$store.state.project.infos) {
          return this.$store.state.project.infos.author;
        }
        return 1;
      },
      set(value) {
        this.$store.commit('updateProject', { infos: { author: value } });
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
    ...mapMutations(['updateProject', 'saveProject']),
    downloadProjectJson() {
      const { project } = this.$store.state;
      const projectJSON = JSON.stringify(project, null, 2);
      downloadjs(projectJSON, `${project.infos.title}.json`, 'application/json');
    },
    async createDirectLink() {
      const { project } = this.$store.state;
      const compressed = pako.deflate(JSON.stringify(project), { to: 'string' });
      const baseUrl = window.location.href.split('?')[0];
      const url = `${baseUrl}?projectData=${encodeURI(base64url.encode(compressed))}`;
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
    saveProjectAfterCheck() {
      const { project } = this.$store.state;
      const { title } = project.infos;
      if (this.$store.state.savedProjects[title]) {
        this.$buefy.dialog.confirm({
          message: `There is already a project named "${title}" in your library
                      and it will be overwritten. Are you sure?`,
          onConfirm: () => this.saveProjectAndToast(project, `Updated project "${title}"`),
        });
      } else {
        this.saveProjectAndToast(project, `New project "${title}" saved`);
      }
    },
    saveProjectAndToast(project, message) {
      this.saveProject(project);
      this.$buefy.toast.open({ message, type: 'is-success' });
    },
  },
  watch: {},
};
</script>

<style lang='scss'>
.share-project-form {
  text-align: center;
  .clipboard-link {
    color: #0e84ffff;
    cursor: pointer;
  }
  .buttons {
    margin-top: 3em;
  }
}
</style>
