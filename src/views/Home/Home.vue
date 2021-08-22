<template lang='pug'>
#home
  home-title
  .home-section: home-library
  .home-section: home-new-project
  .home-section(v-if="isElectron"): home-project-url
  .home-section: home-remix-project
  .home-section: social-sharing-badges
</template>

<script>
import HomeLibrary from './sections/Library.vue';
import HomeNewProject from './sections/NewProject.vue';
import HomeRemixProject from './sections/RemixProject.vue';
import HomeProjectUrl from './sections/ProjectFromURL.vue';
import HomeTitle from './sections/HomeTitle.vue';
import SocialSharingBadges from './sections/SocialSharingBadges.vue';

function isElectron() {
  // Renderer process
  if (typeof window !== 'undefined' && typeof window.process === 'object' && window.process.type === 'renderer') {
    return true;
  }

  // Main process
  if (typeof process !== 'undefined' && typeof process.versions === 'object' && !!process.versions.electron) {
    return true;
  }
  // Detect the user agent when the `nodeIntegration` option is set to true
  if (typeof navigator === 'object' && typeof navigator.userAgent === 'string' && navigator.userAgent.indexOf('Electron') >= 0) {
    return true;
  }
  return false;
}
export default {
  data() {
    return {
      isElectron: isElectron(),
    };
  },
  components: {
    'home-title': HomeTitle,
    'home-library': HomeLibrary,
    'home-new-project': HomeNewProject,
    'home-remix-project': HomeRemixProject,
    'home-project-url': HomeProjectUrl,
    'social-sharing-badges': SocialSharingBadges,
  },
};
</script>

<style lang='scss'>
#home {
  width: 90%;
  max-width: 1000px;
  margin: 0 auto;
  .home-section {
    margin-top: 2em;
    margin-bottom: 4em;
  }
  h2 {
    margin-top: 0;
  }
  .url-form,
  .file-uploader,
  .project-search-bar {
    width: 90%;
    max-width: 600px;
    margin: 1em auto;
  }
}
</style>
