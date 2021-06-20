<template lang="pug">
.appearance-form
  position-form(:element="element")
  resize-form(:element="element")
  opacity-form(:element="element")
</template>

<script>
import PositionForm from '../../common_forms/PositionForm.vue';
import ResizeForm from './ResizeForm.vue';
import OpacityForm from '../../common_forms/OpacityForm.vue';

export default {
  props: {
    element: { type: Object },
  },
  components: {
    'position-form': PositionForm,
    'resize-form': ResizeForm,
    'opacity-form': OpacityForm,
  },
};
</script>
