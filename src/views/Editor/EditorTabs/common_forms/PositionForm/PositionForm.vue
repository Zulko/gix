<template lang="pug">
section.text-position-form
  possibly-time-varying-form(
    label="Position",
    :element="element",
    field="position",
    :valueForm="PositionXyForm",
    :allowModifiers="true"
  )
  b-field(label="Alignment", horizontal)
    b-field(grouped)
      p.control
        b-field(label="Horizontal", label-position="on-border")
          b-select(
            :value="element.xAlign",
            @input="(v) => updateElement({ xAlign: v })"
          )
            option(label="Left", value="left")
            option(label="Center", value="center")
            option(label="Right", value="right")
      p.control
        b-field(label="Vertical", label-position="on-border")
          b-select(
            :value="element.yAlign",
            @input="(v) => updateElement({ yAlign: v })"
          )
            option(label="Top", value="top")
            option(label="Center", value="center")
            option(label="Bottom", value="bottom")
      p.control(
        style="margin-top: -0.5em",
        v-if="element.type !== 'rectangle'"
      )
        span Mirror
        br
        b-checkbox(
          :value="element.mirror",
          @input="(v) => updateElement({ mirror: v })"
        )
  possibly-time-varying-form(
    label="Rotation",
    :element="element",
    field="rotation",
    :valueForm="RotationForm",
    :allowModifiers="true"
  )
</template>

<script>
import ElementComponentMixin from '../../ElementComponentMixin.vue';
import PossiblyTimeVaryingForm from '../PossiblyTimeVaryingForm.vue';
import PositionXyForm from './PositionXyForm.vue';
import RotationForm from './RotationForm.vue';

export default {
  extends: ElementComponentMixin,
  data() {
    return { PositionXyForm, RotationForm };
  },
  components: {
    'possibly-time-varying-form': PossiblyTimeVaryingForm,
  },
};
</script>

<style lang="scss">
.text-position-form {
  .numberinput {
    width: 120px;
  }
}
</style>
