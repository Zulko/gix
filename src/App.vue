<template lang="pug">
#app
  navbar
  router-view
  app-footer
</template>

<script>
import Navbar from './Navbar.vue';
import Footer from './Footer.vue';

export default {
  name: 'App',
  components: {
    navbar: Navbar,
    'app-footer': Footer,
  },
  mounted() {},
};
</script>

<style lang="scss">
@import "https://fonts.googleapis.com/css?family=PT+Sans+Narrow|Caveat+Brush";
#app {
  font-family: "Lato", Helvetica, Arial, sans-serif !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  position: relative;
}

.inline-setting-text,
.inline-setting-widget {
  display: inline-block;
  vertical-align: middle;
}
.inline-setting-text {
  margin-left: 15px;
  margin-right: 5px;
  &:first-of-type {
    margin-left: 0px;
  }
}

html {
  margin: 0;
  background-color: #ffffff;
  // background-image: url(/gix/img/background-2.svg);
  background-image: url(~./assets/background-2.svg);
  background-size: cover;
  background-position: top right;
  background-repeat: repeat-y;
  min-height: 100%;
}

h1,
h2,
h3 {
  font-family: "Caveat Brush";
  text-align: center;
  font-weight: normal;
}
h1 {
  font-size: 8em;
  margin: 0em;
}
h2 {
  text-transform: uppercase;
  font-size: 2em;
}

hr {
  height: 1.5px;
  border: none;
  background-color: #eee;
}
.progress {
  transition: none;
}

// .field {
//   text-align: center;
// }
// .field.is-floating-label .label {
//   left: none;
//   text-align: center;
//   margin: 0 auto;
// }
</style>
