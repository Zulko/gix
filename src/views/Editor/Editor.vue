<template lang='pug'>
b-tabs.editor-page(v-model='activeTab' class="block" :animated='false')
  b-tab-item(label='Edit', name='edit')
    edit(:isActive="activeTab === 0")
  b-tab-item(
    v-if="$store.state.project.isAnimated",
    label='Export GIF',
    name='exportGIF',
    :lazy='true'
  )
    export-gif(:isActive="activeTab === 1")
  b-tab-item(
    v-if="$store.state.project.projectType === 'image'"
    label='Export image',
    name='exportImage',
    :lazy='true'
  )
    export-image
  b-tab-item(label='Save / share', name='share')
    share
</template>

<script>
import base64url from 'base64url';
import pako from 'pako';
import { mapMutations } from 'vuex';
import Edit from './tabs/Edit/Edit.vue';
import ExportGif from './tabs/ExportGif.vue';
import ExportImage from './tabs/ExportImage.vue'; //eslint-disable-line
import Share from './tabs/Share.vue';

export default {
  props: {
    query: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      activeTab: 0,
    };
  },
  methods: {
    ...mapMutations([
      'setProject',
    ]),
  },
  mounted() {
    if (this.query.projectData) {
      const byteCharacters = base64url.decode(this.query.projectData);
      const jsonData = pako.inflate(byteCharacters, { to: 'string' });
      const projectData = JSON.parse(jsonData);
      this.setProject(projectData);
      this.$router.push({ name: 'editor' });
    }
  },
  components: {
    edit: Edit,
    'export-gif': ExportGif,
    'export-image': ExportImage,
    share: Share,
  },
};
</script>

<style lang='scss'>
.editor-page {
  width: 90%;
  max-width: 1000px;
  margin: 3em auto;
  > .tabs ul {
    border-bottom-width: 0px;
  }
  > .tabs li.is-active a {
    border-bottom-width: 2px;
  }
}
</style>
