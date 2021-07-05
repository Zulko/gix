<template lang="pug">
b-field.size-form(grouped, group-multiline)
  p.control
    b-field(label="Width", label-position="on-border")
      b-numberinput.number-input(
        size="is-small",
        controls-position="compact",
        :min="0",
        :value="value.width",
        @input="updateWidth"
      )
  p.control
    b-field(label="Height", label-position="on-border")
      b-numberinput.number-input(
        controls-position="compact",
        size="is-small",
        :min="0",
        :value="value.height",
        @input="updateHeight"
      )
  p.control(style="margin-top")
    b-checkbox(v-model="keepAspectRatio", size="is-small")
      span Keep ratio
</template>

<script>
import { mapMutations } from 'vuex';
import ElementComponentMixin from '../../ElementComponentMixin.vue';

export default {
  extends: ElementComponentMixin,
  props: {
    value: { type: Object },
    element: { type: Object },
  },
  data() {
    return {
      keepAspectRatio: true,
    };
  },
  methods: {
    ...mapMutations(['updateProject', 'updateElement']),
    updateWidth(width) {
      if (width === this.value.width) {
        return;
      }
      if (this.keepAspectRatio) {
        const height = Math.round(width / this.element.size.aspectRatio);
        this.$emit('update', { ...this.value, width, height });
        if (this.element.editorSettings.isMainElement) {
          this.updateProject({ canvas: { height, width } });
        }
      } else {
        this.$emit('update', { ...this.value, width });
        if (this.element.editorSettings.isMainElement) {
          this.updateProject({ canvas: { width } });
        }
      }
    },
    updateHeight(height) {
      if (height === this.elementHeight) {
        return;
      }
      if (this.keepAspectRatio) {
        const width = Math.round(height * this.element.size.aspectRatio);
        this.$emit('update', { ...this.value, width, height });
        if (this.element.editorSettings.isMainElement) {
          this.updateProject({ canvas: { height, width } });
        }
      } else {
        this.$emit('update', { ...this.value, height });
        if (this.element.editorSettings.isMainElement) {
          this.updateProject({ canvas: { height } });
        }
      }
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
.size-form {
  .number-input {
    width: 120px;
  }
}
</style>
