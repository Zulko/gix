<template lang="pug">
element-settings(:element='element', :showOptions='showOptions').text-element-settings
  b-tabs(tab-position='left')
    b-tab-item(v-for='pane in panes', :key='pane.title', :label='pane.title')
      div(:is='pane.form', :element='element')
</template>

<script>
import ElementsSettings from '../ElementSettings.vue';
import PositionForm from '../common_forms/PositionForm.vue';
import EditorSettings from '../common_forms/EditorSettings.vue';
import SourceForm from './forms/SourceForm.vue';
import ResizeForm from './forms/ResizeForm.vue';
import TimeSegmentForm from '../common_forms/TimeSegmentForm.vue';
import ElementComponentMixin from '../ElementComponentMixin.vue';

export default {
  extends: ElementComponentMixin,
  data() {
    return {
      panes: [
        {
          title: 'Source',
          form: SourceForm,
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
          title: 'Crop & Resize',
          form: ResizeForm,
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
