<template lang='pug'>
#editor-page
  .two-column(
    v-if="windowWidth > twoColumnWidth",
    :style="{ width: twoColumnWidth + 'px' }"
  )
    .block(
      v-if="$store.state.project.canvas",
      style="width: 850px; display: inline-block; vertical-align: top"
    )
      editor-tabs
    editor-gix-player
  .one-column(
    v-else,
    style="max-width: 900px; width: 90%; display: block; margin: 1em auto"
  )
    editor-gix-player
    br
    editor-tabs(v-if="$store.state.project.canvas")
</template>

<script>
import base64url from 'base64url';
import pako from 'pako';
import { mapMutations } from 'vuex';
import EditorGixPlayer from './EditorGixPlayer.vue';
import EditorTabs from './EditorTabs.vue';

export default {
  props: {
    query: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      windowWidth: window.innerWidth,
      txt: '',
    };
  },
  computed: {
    twoColumnWidth() {
      if (!this.$store.state.project.canvas) {
        return 1700;
      }
      return 650 + 850;
    },
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onResize);
  },

  methods: {
    ...mapMutations(['setProject']),
    onResize() {
      this.windowWidth = window.innerWidth;
    },
  },
  components: {
    'editor-gix-player': EditorGixPlayer,
    'editor-tabs': EditorTabs,
  },
  mounted() {
    if (this.query.projectData) {
      const byteCharacters = base64url.decode(this.query.projectData);
      const jsonData = pako.inflate(byteCharacters, { to: 'string' });
      const projectData = JSON.parse(jsonData);
      this.setProject(projectData);
      this.$router.push({ name: 'editor' });
    } else if (!this.$store.state.project.canvas) {
      this.$router.push({ name: 'home' });
    } else {
      this.$nextTick(() => {
        window.addEventListener('resize', this.onResize);
      });
    }
  },
};
</script>

<style lang='scss'>
#editor-page {
  .two-column {
    margin: 1em auto;
    display: block;
    .editor-gix-player {
      display: inline-block;
      padding-left: 50px;
      vertical-align: top;
      position: fixed;
      border-left: 2px solid #eee;
    }
  }
  margin: 0 auto;
  > .tabs ul {
    border-bottom-width: 0px;
  }
  > .tabs li.is-active a {
    border-bottom-width: 2px;
  }
  .gix-preview {
    margin-bottom: 1em;
  }
  .el-input-number.is-controls-right .el-input__inner,
  .el-input__inner {
    padding-left: 5px;
    padding-right: 5px;
    text-align: left;
  }
  .el-select {
    width: 90px;
  }
  .controls-warning {
    margin: 0;
    font-size: 12px;
  }
  .el-form-item {
    margin: 0 5px 0;
  }
  .el-form-item__label {
    padding: 0 5px 0 0;
  }
  .gix-preview {
    position: relative;
  }
  .gix-context-menu {
    position: absolute;
  }
}
</style>
