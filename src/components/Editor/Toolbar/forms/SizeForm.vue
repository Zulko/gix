<template lang="pug">
.golbal-time-form
  el-form
    el-form-item(label='Dimensions WxH')
      el-input-number(
        size='mini', controls-position="right",
        :step='1',
        style='width: 100px;'
        v-model='canvasWidth')
      span(style='text-align: center; width: 2em; display: inline-block') -
      el-input-number(
        size='small', controls-position="right",
        :step='1',
        style='width: 100px;'
        v-model='canvasHeight')
    el-form-item(label='Keep aspect ratio')
      el-checkbox(:value='aspectRatioCheckboxValue',
                  @change='changeAspectRatioCheckbox')
    hr
    el-form-item(label='Add margins')
      el-button(v-for="direction in ['Up', 'Down', 'Left', 'Right']"
                :key='direction'
                icon='el-icon-plus', size='mini'
                @click='addMargin(direction)') {{direction}}
    el-form-item(label='Background color')
      el-color-picker.inline-setting-widget(
        size='small',
        :value="canvas ? canvas.bgColor: 'black'",
        @input='v => updateProject({canvas: {bgColor: v}})'
      )
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  computed: {
    canvas () {
      return this.$store.state.project.canvas
    },
    canvasWidth: {
      get () {
        return this.canvas ? this.canvas.width : 0
      },
      set (width) {
        if (width === this.canvasWidth) {
          return
        }
        var ratio = this.canvas ? this.canvas.aspectRatio : 0
        if (ratio) {
          var height = Math.round(width / ratio)
          this.updateProject({canvas: {width, height}})
        } else {
          this.updateProject({canvas: {width}})
        }
      }
    },
    canvasHeight: {
      get () {
        return this.canvas ? this.canvas.height : 0
      },
      set (height) {
        if (height === this.canvasHeight) {
          return
        }
        var ratio = this.canvas ? this.canvas.aspectRatio : 0
        if (ratio) {
          var width = Math.round(height * ratio)
          this.updateProject({canvas: {width, height}})
        } else {
          this.updateProject({canvas: {height}})
        }
      }
    },
    aspectRatioCheckboxValue () {
      return this.canvas ? !(!this.canvas.aspectRatio) : false
    }
  },
  methods: {
    ...mapMutations([
      'updateProject'
    ]),
    changeAspectRatioCheckbox (val) {
      console.log('changeAspectRatioCheckbox', val)
      if (val) {
        var aspectRatio = this.canvasWidth / this.canvasHeight
        this.updateProject({canvas: {aspectRatio}})
      } else {
        this.updateProject({canvas: {aspectRatio: 0}})
      }
    },
    addMargin (direction) {
      if (direction === 'Up') {
        this.updateProject({canvas: {height: this.canvasHeight + 1}})
      } else if (direction === 'Down') {
        this.updateProject({canvas: {height: this.canvasHeight + 1}})
      } else if (direction === 'Left') {
        this.updateProject({canvas: {width: this.canvasWidth + 1}})
      } else if (direction === 'Right') {
        this.updateProject({canvas: {width: this.canvasWidth + 1}})
      }
    }
  }
}
</script>
