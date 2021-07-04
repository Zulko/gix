<template lang="pug">
.text-form
  possibly-time-varying-form(
    :element="element",
    field="text",
    :valueForm="TextInput",
    :allowModifiers="false"
  )
  br
  font-form(:element="element")
  color-form(:element="element")
</template>

<script>
import ElementComponentMixin from '../ElementComponentMixin.vue';
import FontPicker from './forms/FontForm/FontPicker.vue';
import PossiblyTimeVaryingForm from '../common_forms/PossiblyTimeVaryingForm.vue';
import ColorForm from '../common_forms/ColorForm.vue';
import TextInput from './forms/TextInput/TextInput.vue';
import FontForm from './forms/FontForm/FontForm.vue';

export default {
  extends: ElementComponentMixin,
  data() {
    return { TextInput };
  },
  components: {
    'font-picker': FontPicker,
    'possibly-time-varying-form': PossiblyTimeVaryingForm,
    'color-form': ColorForm,
    'text-input': TextInput,
    'font-form': FontForm,
  },
};
</script>
<style lang="scss">
.text-form {
  width: 100%;
  .input-number {
    width: 120px;
  }
}
</style>
