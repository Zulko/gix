<template lang="pug">
.text-position-form
  b-field(
    grouped group-multiline
    label='Resize'
    message="Changing the size of this element will resize the whole project")

    p.control
      b-field(label='Width' label-position='on-border')
        b-numberinput.number-input(
          size='mini', controls-position="compact", :min='0',
          v-model='elementWidth'
        )
    p.control
      b-field(label='Height' label-position='on-border')
        b-numberinput.number-input(
          controls-position='compact'
          size='mini', :min='0',
          v-model='elementHeight'
        )
    p.control(style='margin-top: -0.4em') Keep aspect ratio
      br
      b-checkbox(:value='keepAspectRatio',
                 @change='changeAspectRatioCheckbox')
  b-field(grouped group-multiline label='Crop')
    p.control(v-for="direction in ['top', 'bottom', 'left', 'right']")
      b-field(:label="direction" label-position='on-border')
        b-numberinput.number-input(
            size='mini', controls-position="compact", :min='0',
            :value='element.crop[direction]',
            @input='v => updateCrop(v, direction)')
</template>

<script>
import { mapMutations } from 'vuex';
import ElementComponentMixin from '../../ElementComponentMixin.vue';

export default {
  extends: ElementComponentMixin,
  data() {
    return {
      keepAspectRatio: true,
    };
  },
  methods: {
    ...mapMutations([ 'updateProject' ]),
    updateCrop(v, direction) {
      const oldValue = this.element.crop[direction];
      const change = v - oldValue;
      if (!change) {
        return;
      }
      const data = { crop: {} };
      data.crop[direction] = v;
      const assetStats = this.$store.state.assetStats[this.element.id];
      if ((direction === 'top') || (direction === 'bottom')) {
        const currentHeight = assetStats.height - this.element.crop.top - this.element.crop.bottom;
        const propHeightChange = change / currentHeight;
        data.size = {
          height: Math.round(this.element.size.height * (1 - propHeightChange)),
          aspectRatio: this.element.size.aspectRatio / (1 - propHeightChange),
        };
      } else {
        const currentWidth = assetStats.width - this.element.crop.left - this.element.crop.right;
        const propWidthChange = change / currentWidth;
        data.size = {
          width: Math.round(this.element.size.width * (1 - propWidthChange)),
          aspectRatio: this.element.size.aspectRatio * (1 - propWidthChange),
        };
      }
      this.updateElement(data);
      if (this.element.editorSettings.isMainElement) {
        console.log('here');
        this.updateProject({ canvas: { width: data.size.width, height: data.size.height } });
      }
    },
    changeAspectRatioCheckbox() {},
  },
  computed: {
    elementWidth: {
      get() {
        return this.element.size.width;
      },
      set(width) {
        if (width === this.elementWidth) {
          return;
        }
        if (this.keepAspectRatio) {
          const height = Math.round(width / this.element.size.aspectRatio);
          this.updateElement({ size: { width, height } });
          if (this.element.editorSettings.isMainElement) {
            this.updateProject({ canvas: { height, width } });
          }
        } else {
          this.updateElement({ size: { width } });
          if (this.element.editorSettings.isMainElement) {
            this.updateProject({ canvas: { width } });
          }
        }
      },
    },
    elementHeight: {
      get() {
        return this.element.size.height;
      },
      set(height) {
        if (height === this.elementHeight) {
          return;
        }
        if (this.keepAspectRatio) {
          const width = Math.round(height * this.element.size.aspectRatio);
          this.updateElement({ size: { width, height } });
          if (this.element.editorSettings.isMainElement) {
            this.updateProject({ canvas: { height, width } });
          }
        } else {
          this.updateElement({ size: { height } });
          if (this.element.editorSettings.isMainElement) {
            this.updateProject({ canvas: { height } });
          }
        }
      },
    },
  },
  watchers: {
    keepAspectRatio(val) {
      if (val) {
        const aspectRatio = this.elementWidth / this.elementHeight;
        this.updateElement({ size: { aspectRatio } });
      }
    },
  },
};
</script>

<style lang="scss">
.text-position-form {
  .number-input {
    width: 150px;
  }
  // button {
  //   padding: 8px !important;
  // }
}
</style>
