<template lang="pug">
.time-varying-form(style="width: 100%")
  table.table.is-fullwidth
    tbody
      tr(v-for="(data, i) in timeVariable", :key='i')
        td
          p.control(style='display: inline-block')
            b-button(
              size="is-small",
              @click="goToTime(data.t)",
              icon-left="map-marker",
              style="di"
            )
          p.control(style='display: inline-block')
            b-field(label="Time", label-position="on-border")
              b-numberinput.numberinput(
                label="time",
                controls-position="compact",
                :value="data.t",
                size="is-small",
                :step="0.01",
                :min = 'i > 0 ? timeVariable[i - 1].t : 0'
                :max = 'i < timeVariable.length - 1 ? timeVariable[i + 1].t : projectDuration'
                @input="(v) => updateByIndex(i, 't', v)"
              )
        td
          span(
            :is="form",
            :value="data.value",
            :element='element',
            @update="(v) => updateByIndex(i, 'value', v)"
          )
        td(v-if="allowModifiers")
          b-select(:value='data.modifier', @input="(v) => updateByIndex(i, 'modifier', v)")
            option(key='none', :value='null') None
            option(
              v-for='option in easingOptions'
              :key='option'
              :value='option'
            ) {{ option.split('ease')[1]}}
        td
          b-field(position="is-right")
            p.control
              b-button(
                size="is-small",
                @click="duplicateLine(i)",
                icon-left="content-copy",
                style="margin-right: 1em"
              )
              b-button(
                size="is-small",
                @click="deleteLine(i)",
                icon-left="trash-can-outline",
                style="color: darkred"
              )
</template>

<script>
import * as easings from 'js-easing-functions';
import ElementComponentMixin from '../ElementComponentMixin.vue';

export default {
  mixins: [ElementComponentMixin],
  props: {
    field: { type: String },
    form: { type: Object },
    allowModifiers: { type: Boolean },
  },
  data() {
    const easingOptions = Object.keys(easings);
    easingOptions.sort();
    return {
      easingOptions,
    };
  },
  computed: {
    timeVariable() {
      return this.element[this.field].timeVariable;
    },
    projectDuration() {
      return (this.$store.state.project.duration);
    },
  },
  methods: {
    updateByIndex(i, field, value) {
      this.updateElement({
        [this.field]: {
          timeVariable: this.timeVariable.map(
            (data, index) => (index === i ? { ...data, [field]: value } : data),
          ),
        },
      });
    },
    duplicateLine(i) {
      const newTimeVariable = [...this.timeVariable];
      const newRecord = JSON.parse(JSON.stringify(newTimeVariable[i]));
      newTimeVariable.push({ ...newRecord, t: newRecord.t + 0.01 });
      newTimeVariable.sort((r1, r2) => (r1.t < r2.t ? -1 : 1));
      this.updateElement({ [this.field]: { timeVariable: newTimeVariable } });
    },
    deleteLine(i) {
      this.updateElement({
        [this.field]: {
          timeVariable: this.timeVariable.filter((data, index) => (index !== i)),
        },
      });
    },
    goToTime(t) {
      this.$store.commit('setEditorPlayerTime', t);
    },
  },
};
</script>
<style lang='scss'>
.time-varying-form {
  .numberinput {
    width: 120px !important;
  }
}
</style>
