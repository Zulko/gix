<template lang="pug">
.appearance-form
  position-form(:element="element")
  resize-form(:element="element")
  b-field(label="Opacity")
    possibly-time-varying-form(
      :element="element",
      field="opacity",
      :valueForm="OpacityForm",
      :allowModifiers="true"
    )
</template>

<script>
import PositionForm from '../../common_forms/PositionForm/PositionForm.vue';
import ResizeForm from './ResizeForm.vue';
import OpacityForm from '../../common_forms/OpacityForm.vue';
import PossiblyTimeVaryingForm from '../../common_forms/PossiblyTimeVaryingForm.vue';

export default {
  props: {
    element: { type: Object },
  },
  data() {
    return {
      OpacityForm,
    };
  },
  components: {
    'position-form': PositionForm,
    'resize-form': ResizeForm,
    'opacity-form': OpacityForm,
    'possibly-time-varying-form': PossiblyTimeVaryingForm,
  },
};
</script>
