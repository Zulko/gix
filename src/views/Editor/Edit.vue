<template lang="pug">
.editor-edit
  .gix-preview
    gix-player(
      v-if="this.$store.state.project.elements",
      :project="this.$store.state.project",
      :showStats="true",
      :showControls="true",
      :freeze="this.$store.state.freezeGifPreview",
      @dragged="onElementDragged"
    )
  undo-redo-widget(style="text-align: right")
  editor-tabs(v-if="$store.state.project.canvas")
</template>
<script>
import { mapMutations } from 'vuex';
import GixPlayer from '../../components/GixAnimation/GixPlayer.vue';
import UndoRedoWidget from '../../components/UndoRedoWidget.vue';
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
    'undo-redo-widget': UndoRedoWidget,
  },
  methods: {
    ...mapMutations(['updateElement']),
    onElementDragged(e) {
      this.$store.commit('setEditorTabIndexToElementId', e.element.id);
      let update;
      if (e.dragType === 'translation') {
        update = {
          position: {
            x: e.element.position.x + e.drag.x,
            y: e.element.position.y + e.drag.y,
          },
        };
      } else if (e.dragType === 'rotation') {
        const atan = Math.atan2(20 - e.drag.y, e.drag.x);
        const dragAngle = parseInt((-360 * atan) / (2 * Math.PI) + 90, 10);
        update = {
          position: {
            rotation: ((e.element.position.rotation || 0) + dragAngle) % 360,
          },
        };
      } else if (e.dragType === 'resizing') {
        const ratio = (20 - e.drag.y) / 20;
        if (e.element.type === 'asset' || e.element.type === 'rectangle') {
          update = {
            size: {
              height: Math.max(10, parseInt(ratio * e.element.size.height, 10)),
              width: Math.max(10, parseInt(ratio * e.element.size.width, 10)),
              aspectRatio: e.element.size.aspectRatio,
            },
          };
        } else if (e.element.type === 'text') {
          update = {
            font: {
              size: Math.max(10, parseInt(ratio * e.element.font.size, 10)),
            },
            stroke: {
              width: ratio * e.element.stroke.width,
            },
          };
        }
      }
      this.updateElement({ elementId: e.element.id, update });
    },
  },
};
</script>
<style lang="scss">
.editor-edit {
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
}
</style>
