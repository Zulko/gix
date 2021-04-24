<template lang="pug">
el-carousel.elemented-gif-carousel(:interval="4000" type="card" height="250px")
  el-carousel-item(v-for="project in projects", :key="project.title",
                   @change='handleSlideChange()')
    center
      h3 {{ project.title }}
</template>

<script>
export default {
  props: {
    projects: { default: () => ([]), type: Array },
  },
  method: {
    handleSlideChange() {},
  },
};
</script>

<style lang='scss' scoped>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}
</style>
