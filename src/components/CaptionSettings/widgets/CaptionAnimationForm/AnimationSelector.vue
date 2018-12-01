<template lang="pug">
.animation-selector.inline-setting-widget
   el-cascader(size='mini', :options='animations[category]'
               expand-trigger="hover" v-model='animation.class')
   el-select(v-model='animation.speed' size='mini' v-if="animation.class[0] !== 'none'")
     el-option(value='slower' label='Slower')
     el-option(value='slow' label='Slow')
     el-option(value='normal-speed' label='Normal speed')
     el-option(value='fast' label='Fast')
     el-option(value='faster' label='Faster')
</template>

<script>

const animations = require('./animations.json')
export default {
  props: {
    value: {default: () => (['none'])},
    category: {default: 'entrances'}
  },
  data () {
    return {
      animation: Object.assign({}, this.value),
      animations
    }
  },
  watch: {
    animation: {
      deep: true,
      handler (val) {
        this.$emit('input', val)
      }
    }
  }
}
</script>
