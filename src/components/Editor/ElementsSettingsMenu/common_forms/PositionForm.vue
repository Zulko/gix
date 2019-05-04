<template lang="pug">
.text-position-form
  //- .inline-setting-text
  //-   el-tooltip(content="Click me then click somewhere on the GIF")
  //-     el-button(size='mini' circle,
  //-               @click="awaitPositionClick()")
  //-       .icon(:is="icons.map", title='')
  el-form(label-width="120px")
    el-form-item(label='Position')
      el-select(size='small'
                :value='element.position.isMoving',
                @input='v => updateElement({position: {isMoving: v}})')
        el-option(label='Fixed', :value='false')
        el-option(label='Moving', :value='true')
    el-form-item(label='Coordinates X-Y')
      el-col(:span='10'): center
        el-input-number(
          size='mini', controls-position="right",
          :value='element.position.x',
          @input='v => updateElement({position: {x: v}})')
      el-col(:span='1'): center -
      el-col(:span='10'): center
        el-input-number(
          size='mini', controls-position="right",
          :value='element.position.y',
          @input='v => updateElement({position: {y: v}})')
    el-form-item(label='Alignment')
      el-col(:span='10'): center
        el-select(size='small',
                  :value='element.position.xAlign',
                  @input='v => updateElement({position: {xAlign: v}})')
          el-option(label='Left', value='left')
          el-option(label='Center', value='center')
          el-option(label='Right', value='right')
      el-col(:span='1'): center -
      el-col(:span='10'): center
        el-select(size='small',
                  :value='element.position.yAlign',
                  @input='v => updateElement({position: {yAlign: v}})')
          el-option(label='Top', value='top')
          el-option(label='Center', value='center')
          el-option(label='Bottom', value='bottom')
    el-form-item(label='Draggable')
      el-checkbox(:value='element.isDraggable',
                  @input='v => updateElement({isDraggable: v})')
</template>

<script>

export default {
  extends: require('../ElementComponentMixin.vue').default
}
</script>

<style lang="scss">
.text-position-form {
  .el-input-number {
    width: 70px;
  }
}
</style>
