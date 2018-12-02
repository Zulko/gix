<template lang='pug'>
  #app
    navbar
    router-view
    app-footer
</template>

<script>
export default {
  name: 'App',
  components: {
    navbar: require('./Navbar.vue').default,
    'app-footer': require('./Footer.vue').default
  }
}
</script>

<style>
@import 'https://fonts.googleapis.com/css?family=Raleway';
#app {
  font-family: 'Raleway', Helvetica, Arial, sans-serif !important;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.el-tooltip__popper,
.el-cascader-menu__item,
.el-select-dropdown__item,
.el-notification {
  font-family: 'Lato' !important;
}

/* .el-cascader__label {
  font-family: 'Oswald';
} */

.inline-setting-text, .inline-setting-widget {
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

body {
  position: relative;
  background-color: #ffffff;
  background-image: url(/static/img/background.svg);
  background-size: cover;
  background-repeat: repeat-y;
  min-height: 100%;
}
html {
  box-sizing: border-box;
}
*,
*:before,
*:after {
  box-sizing: inherit;
}

h1, h2 {
  font-family: 'Permanent Marker';
  text-align: center;
  font-weight: normal;
}
h1 {
  font-size: 8em;
  margin: 0em;
}
h2 {
  font-size: 2em;
}
</style>
