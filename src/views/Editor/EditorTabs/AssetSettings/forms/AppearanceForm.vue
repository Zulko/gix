<template lang="pug">
.appearance-form
  possibly-time-varying-form(
    label="Size",
    :element="element",
    field="size",
    :valueForm="SizeForm",
    :allowModifiers="true"
  )
  position-form(:element="element")
  possibly-time-varying-form(
    label="Opacity",
    :element="element",
    field="opacity",
    :valueForm="OpacityForm",
    :allowModifiers="true"
  )
</template>

<script>
import PositionForm from '../../common_forms/PositionForm/PositionForm.vue';
import SizeForm from './SizeForm.vue';
import OpacityForm from '../../common_forms/OpacityForm.vue';
import PossiblyTimeVaryingForm from '../../common_forms/PossiblyTimeVaryingForm.vue';

export default {
  props: {
    element: { type: Object },
  },
  data() {
    return {
      OpacityForm,
      SizeForm,
    };
  },
  components: {
    'position-form': PositionForm,
    'opacity-form': OpacityForm,
    'possibly-time-varying-form': PossiblyTimeVaryingForm,
  },
};
</script>
