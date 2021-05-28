<template lang="pug">
.text-position-form
  b-field(grouped, label="Position")
    p.control
      b-field(label="Position", label-position="on-border")
        b-select(
          size="small",
          :value="element.position.isMoving",
          @input="(v) => updateElement({ position: { isMoving: v } })"
        )
          option(label="Fixed", :value="false")
          option(label="Moving", :value="true")
    p.control
      b-field(label="X", label-position="on-border")
        b-numberinput.numberinput(
          controls-position="compact",
          :value="element.position.x",
          @input="(v) => updateElement({ position: { x: v } })"
        )
    p.control
      b-field(label="Y", label-position="on-border")
        b-numberinput.numberinput(
          controls-position="compact",
          :value="element.position.y",
          @input="(v) => updateElement({ position: { y: v } })"
        )
  b-field(grouped, group-multiline, label="Alignment")
    p.control
      b-field(label="Horizontal", label-position="on-border")
        b-select(
          :value="element.position.xAlign",
          @input="(v) => updateElement({ position: { xAlign: v } })"
        )
          option(label="Left", value="left")
          option(label="Center", value="center")
          option(label="Right", value="right")
    p.control
      b-field(label="Vertical", label-position="on-border")
        b-select(
          :value="element.position.yAlign",
          @input="(v) => updateElement({ position: { yAlign: v } })"
        )
          option(label="Top", value="top")
          option(label="Center", value="center")
          option(label="Bottom", value="bottom")
    p.control
      b-field(label="Rotation", label-position="on-border")
        b-numberinput.numberinput(
          controls-position="compact",
          :value="element.position.rotation",
          @input="(v) => updateElement({ position: { rotation: v } })"
        )
</template>

<script>
import ElementComponentMixin from '../ElementComponentMixin.vue';

export default {
  extends: ElementComponentMixin,
};
</script>

<style lang="scss">
.text-position-form {
  .numberinput {
    width: 150px;
  }
}
</style>
