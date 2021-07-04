<template lang="pug">
.text-settings
  element-settings.text-element-settings(
    :element="element",
    :showOptions="showOptions"
  )
    b-tabs(type="is-boxed", :animated="false")
      b-tab-item(v-for="pane in panes", :key="pane.title", :label="pane.title")
        div(:is="pane.form", :element="element")
</template>

<script>
import ElementComponentMixin from '../ElementComponentMixin.vue';
import ElementsSettings from '../ElementSettings.vue';
import PositionForm from '../common_forms/PositionForm/PositionForm.vue';
import EditorSettings from '../common_forms/EditorSettings.vue';
import TextInput from './forms/TextInput/TextInput.vue';
import TextForm from './TextForm.vue';
import TimeSegmentForm from '../common_forms/TimeSegmentForm.vue';

export default {
  extends: ElementComponentMixin,
  data() {
    return {
      panes: [
        {
          title: 'Text',
          form: TextForm,
        },
        {
          title: 'Position',
          form: PositionForm,
        },
        {
          title: 'Time',
          form: TimeSegmentForm,
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
    margin: 0 auto 2em;
  }
}
</style>
