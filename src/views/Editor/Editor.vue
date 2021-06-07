<template lang='pug'>
#editor-page
  .gix-preview
    gix-context-menu.gix-context-menu(
      @closeMenu="closeMenu",
      v-if="contextMenu.isVisible",
      v-click-outside="onClickOutside",
      :element="contextMenu.element",
      :position="contextMenu.position"
    )
    gix-player(
      v-if="this.$store.state.project.elements",
      :project="this.$store.state.project",
      :showStats="true",
      :showControls="true",
      :freeze="this.$store.state.freezeGifPreview",
      @dragged="onElementDragged",
      @context-menu="onContextMenu"
    )

  undo-redo-widget(style="text-align: right")
  editor-tabs(v-if="$store.state.project.canvas")
</template>

<script>
import base64url from 'base64url';
import pako from 'pako';
import { mapMutations } from 'vuex';
import GixPlayer from '../../components/GixAnimation/GixPlayer.vue';
import UndoRedoWidget from '../../components/UndoRedoWidget.vue';
import GixContextMenu from './GixContextMenu.vue';
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
      contextMenu: {
        isVisible: false,
        element: null,
        x: 300,
        y: 300,
        position: { x: 0, y: 0 },
      },
    };
  },
  components: {
    'gix-player': GixPlayer,
    'editor-tabs': EditorTabs,
    'undo-redo-widget': UndoRedoWidget,
    'gix-context-menu': GixContextMenu,
  },
  methods: {
    ...mapMutations(['setProject', 'updateElement']),
    closeMenu() {
      console.log('closeMenu');
      this.contextMenu = { ...this.contextMenu, isVisible: false };
    },
    onClickOutside() {
      this.contextMenu = { ...this.contextMenu, isVisible: false };
    },
    onContextMenu(e) {
      this.contextMenu = {
        isVisible: true,
        element: e.element,
        position: {
          x: e.evt.pageX - this.$el.offsetLeft,
          y: e.evt.pageY - this.$el.offsetTop,
          xOffset: e.evt.offsetX + e.element.position.x,
          yOffset: e.evt.offsetY + e.element.position.y,
        },
      };
    },
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
  mounted() {
    if (this.query.projectData) {
      const byteCharacters = base64url.decode(this.query.projectData);
      const jsonData = pako.inflate(byteCharacters, { to: 'string' });
      const projectData = JSON.parse(jsonData);
      this.setProject(projectData);
      this.$router.push({ name: 'editor' });
    }
  },
};
</script>

<style lang='scss'>
#editor-page {
  width: 90%;
  max-width: 1000px;
  margin: 3em auto;
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
