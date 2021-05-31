<template lang='pug'>
#editor-page
  edit
</template>

<script>
import base64url from 'base64url';
import pako from 'pako';
import { mapMutations } from 'vuex';
import Edit from './Edit.vue';

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
    ...mapMutations(['setProject']),
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
  },
};
</script>

<style lang='scss'>
#editor-page {
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
