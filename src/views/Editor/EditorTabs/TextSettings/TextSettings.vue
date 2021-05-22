<template lang="pug">
.text-settings
  element-settings(:element='element' :showOptions='showOptions').text-element-settings
    text-input.text-input(:element='element')
    b-tabs
      b-tab-item(v-for='pane in panes', :key='pane.title', :label='pane.title')
        div(:is='pane.form', :element='element')
</template>

<script>
import ElementComponentMixin from '../ElementComponentMixin.vue';
import ElementsSettings from '../ElementSettings.vue';
import PositionForm from '../common_forms/PositionForm.vue';
import ColorForm from '../common_forms/ColorForm.vue';
import EditorSettings from '../common_forms/EditorSettings.vue';
import TextInput from './forms/TextInput/TextInput.vue';
import FontForm from './forms/FontForm/FontForm.vue';
import TimeSegmentForm from '../common_forms/TimeSegmentForm.vue';
import EmojiPicker from './forms/TextInput/EmojiPicker.vue';

export default {
  extends: ElementComponentMixin,
  data() {
    return {
      panes: [
        {
          title: 'Position',
          form: PositionForm,
        },
        {
          title: 'Time',
          form: TimeSegmentForm,
        },
        {
          title: 'Font',
          form: FontForm,
        },
        {
          title: 'Color & stroke',
          form: ColorForm,
        },
        {
          title: 'Emojis',
          form: EmojiPicker,
        },
        {
          title: 'Editor',
          form: EditorSettings,
        },
      ],
    };
  },
  components: {
    'element-settings': ElementsSettings,
    'text-input': TextInput,
  },
};
</script>
<style lang="scss">
.text-settings {
  .text-input {
    width: 90%;
    margin: 0 auto 2em ;
  }
}
</style>
