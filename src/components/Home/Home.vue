<template lang="pug">
#home
  .section: home-features
  .section: home-gallery
  .section: home-new-project
  .section: home-remix-project
  .section: home-saved-projects
</template>

<script>
import HomeFeatures from './sections/Features'
import HomeGallery from './sections/Gallery'
import HomeNewProject from './sections/NewProject'
import HomeRemixProject from './sections/RemixProject'
import HomeSavedProjects from './sections/SavedProjects'
export default {
  components: {
    'home-features': HomeFeatures,
    'home-gallery': HomeGallery,
    'home-new-project': HomeNewProject,
    'home-remix-project': HomeRemixProject,
    'home-saved-projects': HomeSavedProjects
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss'>
#home {
  max-width: 90%;
  width: 1000px;
  margin: 0 auto;
  .section {
    margin-top: 7em;
    margin-bottom: 7em;
  }
}
</style>
