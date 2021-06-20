<template lang="pug">
element-settings.text-element-settings(
  :element="element",
  :showOptions="showOptions"
)
  b-tabs(tab-position="left", type="is-boxed", :animated="false")
    b-tab-item(
      v-for="pane in panes",
      :key="pane.title",
      :label="pane.title",
      v-if="pane.title !== 'Time' || !element.editorSettings.isMainElement"
    )
      div(:is="pane.form", :element="element")
</template>

<script>
import ElementsSettings from '../ElementSettings.vue';
import AppearanceForm from './forms/AppearanceForm.vue';
import EditorSettings from '../common_forms/EditorSettings.vue';
import SourceForm from './forms/SourceForm.vue';
import TimeSegmentForm from '../common_forms/TimeSegmentForm.vue';
import ElementComponentMixin from '../ElementComponentMixin.vue';

export default {
  extends: ElementComponentMixin,
  data() {
    return {
      panes: [
        {
          title: 'Source & crop',
          form: SourceForm,
        },
        {
          title: 'Appearance',
          form: AppearanceForm,
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
  },
};
</script>
