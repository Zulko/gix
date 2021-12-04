<template lang="pug">
.project-from-url
  h2 Paste a compressed project URL
  b-input(v-model="url")
  b-loading(:is-full-page="true", v-model="isLoading", :can-cancel="false")
</template>

<script>
import base64url from 'base64url';
import pako from 'pako';
import { mapMutations } from 'vuex';

export default {
  data() {
    return {
      url: '',
      isLoading: false,
    };
  },
  methods: {
    ...mapMutations(['setProject']),
  },
  watch: {
    url(val) {
      if (val.indexOf('projectData') === -1) {
        return;
      }
      this.isLoading = true;
      try {
        const parsedUrl = new URL(val);
        const byteCharacters = base64url.decode(parsedUrl.searchParams.get('projectData'));
        const jsonData = pako.inflate(byteCharacters, { to: 'string' });
        const projectData = JSON.parse(jsonData);
        this.setProject(projectData);
        this.$router.push({ name: 'editor' });
      } catch (err) {
        this.$buefy.toast.open({
          message: `A wild error appeared! ${err}`,
          type: 'is-danger',
        });
      }
      this.isLoading = false;
    },
  },
};
</script>>
<style lang="scss">
.project-from-url {
  max-width: 600px;
  margin: 1em auto;
}
</style>
