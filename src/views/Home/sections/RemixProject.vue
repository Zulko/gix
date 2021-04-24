<template lang='pug'>
.home-remix-project
  h2 Upload a project file

  b-field
  file-uploader(
    @input='handleFileInput',
    fileDescription='GIF or image',
    fileTip='Prefer URLs over uploads to make your projects easier to share'
  )
</template>
<script>
import { mapMutations } from 'vuex';
import FileUploader from '../../../components/widgets/FileUploader.vue';

export default {
  data() {
    return {};
  },
  methods: {
    ...mapMutations(['setProject']),

    handleFileInput(file) {
      const newProject = JSON.parse(file.content);
      this.setProject(newProject);
      this.$router.push('editor');
    },
  },
  components: {
    'file-uploader': FileUploader,
  },
};
</script>
<style lang='scss'>
.home-remix-project {
  h2 {
    margin-top: 0;
  }
}
</style>
