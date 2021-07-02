<template lang="pug">
.home-title
  img(:src="titleSVG")
  h2 GIF, SHARE, REMIX

  p.description.
    Create, share and remix images and GIFs! <br/>
    No account needed, everything runs in your browser.
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
    margin: 0em auto 0;
  }
  h2 {
    font-size: 1.4em;
    margin-top: 0.5em !important;
    color: black;
  }
  .description {
    text-align: center;
    margin: 2em auto;
    font-size: 1.2em;
    color: #333;
  }
}
</style>
