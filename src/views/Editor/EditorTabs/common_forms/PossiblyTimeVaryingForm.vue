<template lang='pug'>
section.possibly-time-varying-variable-form
  b-field(v-if="element[field].timeVariable", :label="label")
    b-field(style="margin-top: 0.5em")
      b-checkbox(
        v-model="isTimeVarying",
        style="margin-right: 0",
        size="is-small"
      )
      span Time-varying
    time-varying-form(
      :element="element",
      :field="field",
      :form="valueForm",
      :allowModifiers="allowModifiers",
      @update="(v) => updateElement({ [field]: { timeVariable: v } })"
    )
  b-field(v-else, :label="label", horizontal)
    .inline(style="display: flex")
      span(
        :is="valueForm",
        :value="element[field]",
        :element="element",
        @update="(v) => updateElement({ [field]: v })"
      )
      p.control(
        style="flex: 0 0 100px; margin-top: -0.8em; margin-left: 0.5em"
      )
        span Time-varying
        br
        b-checkbox(
          v-model="isTimeVarying",
          style="margin-right: 0; margin-left: 0.5em",
          size="is-small"
        )
</template>

<script>
import ElementComponentMixin from '../ElementComponentMixin.vue';
import TimeVaryingForm from './TimeVaryingForm.vue';

export default {
  mixins: [ElementComponentMixin],
  props: {
    label: { type: String },
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
        const { value } = firstRecord;
        if (typeof value === 'object' && value !== null) {
          this.updateElement({ [this.field]: { ...value, timeVariable: null } });
        } else {
          this.updateElement({ [this.field]: value });
        }
      }
    },
  },
  components: {
    'time-varying-form': TimeVaryingForm,
  },
};
</script>

<style lang="scss">
.possibly-time-varying-variable-form {
  margin-bottom: 0.5em;
}
</style>
