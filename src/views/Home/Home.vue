<template lang='pug'>
#home
  home-title
  .home-section: home-library
  .home-section: home-new-project
  .home-section: home-remix-project
</template>

<script>
import HomeLibrary from './sections/Library.vue';
import HomeNewProject from './sections/NewProject.vue';
import HomeRemixProject from './sections/RemixProject.vue';
import HomeTitle from './sections/HomeTitle.vue';

export default {
  components: {
    'home-title': HomeTitle,
    'home-library': HomeLibrary,
    'home-new-project': HomeNewProject,
    'home-remix-project': HomeRemixProject,
  },
};
</script>

<style lang='scss'>
#home {
  width: 90%;
  max-width: 1000px;
  margin: 0 auto;
  .home-section {
    margin-top: 7em;
    margin-bottom: 7em;
  }
  h2 {
    margin-top: 0;
  }
  .url-form, .file-uploader, .project-search-bar {
    width: 90%;
    max-width: 600px;
    margin: 1em auto;
  }
}
</style>
