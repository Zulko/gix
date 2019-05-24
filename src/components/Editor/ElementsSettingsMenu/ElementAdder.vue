<template lang="pug">
el-row.element-adder
  //- el-col(:xs='6', :sm='6' v-for='adder in adders', :key='adder.type')
  .element-adder-div(v-for='adder in adders', :key='adder.type')
    el-tooltip(:content='adder.tooltip', placement='top')
      el-button.flat-button(@click="$emit('addElement', adder.type)" size='mini' circle)
        .icon-container
          .element-adder-icon(:is='adder.icon', title='')
</template>
<script>
import textIcon from 'vue-material-design-icons/MessageTextOutline.vue'
import shapeIcon from 'vue-material-design-icons/Shape.vue'
import imageIcon from 'vue-material-design-icons/Image.vue'
import pasteIcon from 'vue-material-design-icons/ContentPaste.vue'
// import groupIcon from 'vue-material-design-icons/Group.vue'

export default {
  data () {
    return {
      adders: [
        {
          tooltip: 'Add a text',
          icon: textIcon,
          type: 'text'
        },
        {
          tooltip: 'Add a picture or animation',
          icon: imageIcon,
          type: 'asset'
        },
        {
          tooltip: 'Add a shape',
          icon: shapeIcon,
          type: 'shape'
        },
        {
          tooltip: 'Paste from clipboard',
          icon: pasteIcon,
          type: 'clipboard'
        }
      ]
    }
  }
}
</script>
<style lang="scss">
.element-adder {
  // width: 50%;
  // margin: 0 auto;
  .element-adder-div {
    display: inline-block;
    margin-right: 10px;
  }
  .flat-button {
    border: none;
    background: none;
    width: 25px;
  }
}
</style>
