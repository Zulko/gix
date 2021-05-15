<template lang="pug">
.animation-selector.inline-setting-widget
   el-cascader(size='mini', :options='animations[category]'
               expand-trigger="hover" v-model='animation.animation')
   el-select(v-model='animation.speed' size='mini' v-if="animation.animation[0] !== 'none'")
     el-option(value='slower' label='Slower')
     el-option(value='slow' label='Slow')
     el-option(value='normal-speed' label='Normal speed')
     el-option(value='fast' label='Fast')
     el-option(value='faster' label='Faster')
</template>

<script>
const animations = require('./animations.json');

const invertedAnimations = {};
for (const category in animations) {
  const categoryData = {};
  for (const group of animations[category]) {
    categoryData[group.value] = [group.value];
    if (group.children) {
      for (const child of group.children) {
        categoryData[child.value] = [group.value, child.value];
      }
    }
  }
  invertedAnimations[category] = categoryData;
}
export default {
  props: {
    value: { default: () => (['none']) },
    category: { default: 'entrances' },
  },
  data() {
    const valueCopy = { ...this.value };
    valueCopy.animation = invertedAnimations[this.category][this.value.class];
    return {
      animation: valueCopy,
      animations,
      invertedAnimations,
    };
  },
  watch: {
    animation: {
      deep: true,
      handler(val) {
        val = { ...val };
        val.class = val.animation[val.animation.length - 1];
        this.$emit('input', val);
      },
    },
    value: {
      deep: true,
      handler(val) {
        if (val.class !== this.animation.class) {
          val = { ...val };
          val.animation = this.invertedAnimations[this.category][val.class];
          this.animation = val;
        }
      },
    },
  },
};
</script>
