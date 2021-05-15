<template lang="pug">
b-field.font-picker
  b-autocomplete(
    :value='font',
    open-on-focus
    :data="fontsInSelectMenu"
    clearable
    :loading="isFetching"
    :check-infinite-scroll="true"
    @typing="getAllFilteredFonts"
    @select="selectFont"
    @infinite-scroll="getMoreFonts",
    :style='fontStyle(font)'
  )
    template(slot-scope='props')
      .font(:style='fontStyle(props.option.name)') {{ props.option.name }}
</template>

<script>

import fonts from 'google-fonts-complete';
import WebFont from 'webfontloader';

const googleFonts = Object.entries(fonts).map((entry) => {
  const [name, props] = entry;
  return { ...props, name };
});

export default {
  props: {
    value: { default: 'Anton', type: String },
  },
  data() {
    return {
      font: this.value,
      allFilteredFonts: [],
      fontsInSelectMenu: [],
      googleFonts,
      isFetching: false,
    };
  },
  computed: {

  },
  mounted() {
    const self = this;
    setTimeout(() => {
      self.loadFont(self.font);
    }, 100);
  },
  methods: {
    loadFont(font) {
      const self = this;
      return new Promise((resolve) => {
        self.isFetching = true;
        console.log(`loading ${font}...`); //eslint-disable-line
        WebFont.load({
          google: {
            families: [font],
          },
          active() {
            self.isFetching = false;
            console.log(`loaded ${font}...`); //eslint-disable-line
            resolve(true);
          },
          inactive() {
            self.isFetching = false;
            console.log(`failed loading ${font}...`); //eslint-disable-line
            resolve();
          },
        });
      });
    },
    fontStyle(font) {
      return `float: left; font-family: '${font}', 'Lato' !important;`;
    },
    async getAllFilteredFonts(input) {
      this.allFilteredFonts = this.googleFonts.filter(
        (possibleFont) => possibleFont.name.includes(input),
      );
      this.fontsInSelectMenu = this.allFilteredFonts.slice(0, 10);
      for (var font of this.fontsInSelectMenu) {  //eslint-disable-line
        await this.loadFont(font.name); //eslint-disable-line
      }
    },
    async getMoreFonts() {
      const start = this.fontsInSelectMenu.length;
      const end = start + 10;
      const nextFonts = this.allFilteredFonts.slice(start, end);
      for (var font of nextFonts) {  //eslint-disable-line
        await this.loadFont(font.name); //eslint-disable-line
      }
      this.fontsInSelectMenu = [...this.fontsInSelectMenu, ...nextFonts];
    },
    selectFont(option) {
      this.font = option.name;
    },

  },
  watch: {
    async font(val) {
      await this.loadFont(val);
      this.$emit('input', val);
    },
  },
};
</script>
<style lang="scss">
.font-picker {
  input {
    font-family: inherit;
  }
}
</style>
Categories:
- Font being entered by user
- Used in this project
- recently used (anything)
- Recommended (5 fonts)
- Go to google font

Anton
Londrina Solid
Frijole
Permanent marker
Patrick Hand SC

Dynamically remove categories if empty.
"select" adds font to ""recently used"
No filtering

check font loaded here:
https://developer.mozilla.org/en-US/docs/Web/API/FontFaceSet/check
