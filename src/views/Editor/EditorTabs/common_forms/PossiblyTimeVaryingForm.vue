<template lang='pug'>
.possibly-time-varying-variable-form
  div(v-if="element[field].timeVariable")
    b-field(style="margin-top: 0.5em")
      b-checkbox(v-model="isTimeVarying", style="margin-right: 0")
      span Time-varying
    time-varying-form(
      :element="element",
      :field="field",
      :form="valueForm",
      :allowModifiers="allowModifiers",
      @update="(v) => updateElement({ [field]: { timeVariable: v } })"
    )
  div(v-else)
    b-field(grouped)
      p.control(style="display: inline-block")
        span(
          :is="valueForm",
          :value="element[field]",
          @update="(v) => updateElement({ [field]: v })"
        )
      p.control(style="display: inline-block; margin-top: -0.8em")
        span Time-varying
        br
        b-checkbox(
          v-model="isTimeVarying",
          style="margin-right: 0; margin-left: 0.5em"
        )
</template>

<script>
import ElementComponentMixin from '../ElementComponentMixin.vue';
import TimeVaryingForm from './TimeVaryingForm.vue';

export default {
  mixins: [ElementComponentMixin],
  props: {
    field: { type: String },
    valueForm: { type: Object },
    allowModifiers: { type: Boolean },
  },
  data() {
    if (this.element[this.field] === undefined) {
      throw Error(`${this.field} undefined in element ${this.element.id}`);
    }
    const { timeVariable } = this.element[this.field];
    return {
      isTimeVarying: (timeVariable !== undefined),
    };
  },
  watch: {
    isTimeVarying(shouldBeVarying) {
      if (shouldBeVarying) {
        this.updateElement({
          [this.field]: {
            timeVariable: [
              { t: 0, value: this.element[this.field] },
              { t: this.$store.state.project.duration, value: this.element[this.field] },
            ],
          },
        });
      } else {
        const [firstRecord] = this.element[this.field].timeVariable;
        if (typeof firstRecord === 'object' && firstRecord !== null) {
          this.updateElement({ [this.field]: { ...firstRecord.value, timeVariable: null } });
        } else {
          this.updateElement({ [this.field]: firstRecord.value });
        }
      }
    },
  },
  components: {
    'time-varying-form': TimeVaryingForm,
  },
};
</script>
