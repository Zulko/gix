<template lang="pug">
b-navbar.navbar(:mobile-burger="false")
  template(slot="brand")
    b-navbar-item(tag="router-link", :to="{ path: '/' }")
      img(:src="titleSVG")
  template(slot="start")
    b-navbar-item(tag="router-link", to="home") Home
    b-navbar-item(tag="router-link", to="editor", v-if="showEditor") Editor
    b-navbar-item(tag="router-link", to="docs") Docs
</template>
<script>
import titleSVG from './assets/title.svg';

console.log(titleSVG);
export default {
  data() {
    return {
      titleSVG,
    };
  },
  computed: {
    showEditor() {
      return this.$store.state.project.infos;
    },
  },
};
</script>
<style lang='scss'>
.navbar {
  margin: 1em auto 1em 90px;
  background: none;
}
</style>
