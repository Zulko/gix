<template lang="pug">
.navbar
  b-navbar(:mobile-burger="false", :active="true")
    template(slot="brand")
      b-navbar-item(tag="router-link", :to="{ path: '/' }")
        img(:src="titleSVG")
    template(slot="start")
      b-navbar-item(tag="router-link", to="home") Home
      b-navbar-item(tag="router-link", to="editor", v-if="showEditor") Editor
      b-navbar-item
        a(
          href="https://github.com/Zulko/gix/wiki/Gix-documentation",
          target="_blank",
          style="color: inherit"
        )
          b-icon(icon="open-in-new", size="is-small")
          span &nbsp; Docs
</template>
<script>
import titleSVG from './assets/title.svg';

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
