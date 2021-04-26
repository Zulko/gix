<template lang="pug">
b-field.font-picker
  b-autocomplete(
    :value='font',
    open-on-focus,
    :data='fontsInSelectMenu',
    group-field='type',
    group-options='items',
    @select='selectFont',
    @typing='(v) => { font = v; }',
    :style='fontStyle(font)'
  )
    template(slot-scope='props')
      .font(:style='fontStyle(props.option)') {{ props.option }}
</template>

<script>
import WebFont from 'webfontloader';

export default {
  props: {
    value: { default: 'Anton', type: String },
  },
  data() {
    return {
      font: this.value,
      allFilteredFonts: [],
      isFetching: false,
      typedText: '',
    };
  },
  computed: {
    fontsInProject() {
      const fonts = this.$store.state.project.elements
        .map((e) => (e.type === 'text' ? e.font.family : null))
        .filter((e) => e != null);
      fonts.sort();
      return [...new Set(fonts)];
    },
    fontsInUserFavorites() {
      return [];
    },
    fontsInRecentlyUsed() {
      return [];
    },
    fontsInSelectMenu() {
      const self = this;
      return [
        {
          type: 'New font',
          items:
            [
              ...this.fontsInProject,
              ...this.fontsInUserFavorites,
              this.fontsInRecentlyUsed,
            ].indexOf(this.font) >= 0
              ? []
              : [this.font],
        },
        {
          type: 'In this project',
          items: this.fontsInProject.filter((s) => s.includes(self.font)),
        },
        {
          type: 'Recently used',
          items: this.fontsInRecentlyUsed,
        },
        {
          type: 'Your favorites',
          items: this.fontsInUserFavorites,
        },
      ].filter((e) => e.items.length);
    },
  },
  mounted() {
    const self = this;
    setTimeout(() => {
      self.fontsInSelectMenu.map((category) => category.items.forEach(self.loadFont));
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
    selectFont(val) {
      if (val) {
        this.font = val;
        this.loadFont(val);
        this.$emit('input', val);
      }
    },
  },
};
</script>
<style lang="scss">
.font-picker {
  input {
    font-family: inherit;
  }
  .has-text-weight-bold {
    font-family: Lato, Arial, sans-serif;
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
