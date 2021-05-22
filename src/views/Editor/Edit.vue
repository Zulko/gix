<template lang="pug">
.editor-edit
  .gix-preview
    gix-player(
      v-if="this.$store.state.project.elements",
      :project="this.$store.state.project",
      :showStats="true",
      :showControls="true",
      :freeze="this.$store.state.freezeGifPreview",
      @dragged="onElementDragged",
      :time.sync="playerTime"
    )
  editor-tabs(v-if="$store.state.project.canvas")
</template>
<script>
import { mapMutations } from 'vuex';
import GixPlayer from '../../components/GixAnimation/GixPlayer.vue';
import EditorTabs from './EditorTabs.vue';

export default {
  props: {
    isActive: { type: Boolean, default: false },
  },
  data() {
    return {
      activeName: 'elements',
    };
  },
  components: {
    'gix-player': GixPlayer,
    'editor-tabs': EditorTabs,
  },
  computed: {
    playerTime: {
      get() {
        return this.$store.state.editorPlayerTime;
      },
      set(value) {
        this.$store.commit('updateEditorPlayerTime', value);
      },
    },
  },
  methods: {
    ...mapMutations(['updateElement']),
    onElementDragged(e) {
      this.updateElement({
        elementId: e.element.id,
        update: {
          position: {
            x: e.element.position.x + e.drag.x,
            y: e.element.position.y + e.drag.y,
          },
        },
      });
    },
  },
};
</script>
<style lang="scss">
.editor-edit {
  .gix-preview {
    margin-bottom: 4em;
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
}
</style>
