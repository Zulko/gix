<template lang="pug">
.home-title
  img(:src="titleSVG")
  h2 GIF, SHARE, REMIX
</template>
<script>
import titleSVG from '../../../assets/title.svg';

export default {
  data() {
    return {
      titleSVG,
    };
  },
};
</script>
<style lang='scss'>
.home-title {
  img {
    height: 80px;
    display: block;
    margin: 2em auto 0;
  }
  h2 {
    font-size: 1.4em;
    margin-top: 0.5em !important;
    color: black;
  }
}
</style>
