<template lang='pug'>
#editor-page
  .gix-preview
    gix-context-menu.gix-context-menu(
      @closeMenu="closeMenu",
      v-if="contextMenu.isVisible",
      v-click-outside="closeMenu",
      :element="contextMenu.element",
      :position="contextMenu.position"
    )
    gix-player(
      v-if="this.$store.state.project.elements",
      :project="dragModifiedProject",
      :showStats="true",
      :showControls="true",
      :freeze="this.$store.state.freezeGifPreview",
      @dragging="onDragging",
      @draggingStopped="onDraggingStopped",
      @context-menu="onContextMenu"
    )

  undo-redo-widget(style="text-align: right")
  editor-tabs(v-if="$store.state.project.canvas")
</template>

<script>
import base64url from 'base64url';
import pako from 'pako';
import { mapMutations } from 'vuex';
import lodash from 'lodash';
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
        x: 0,
        y: 0,
        position: { x: 0, y: 0 },
      },
      dragModifiedElement: null,
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
      this.contextMenu = { ...this.contextMenu, isVisible: false };
    },
    onContextMenu(e) {
      const offsetX = e.element ? e.element.position.x : 0;
      const offsetY = e.element ? e.element.position.y : 0;

      this.contextMenu = {
        isVisible: true,
        element: e.element,
        position: {
          x: e.evt.pageX - this.$el.offsetLeft,
          y: e.evt.pageY - this.$el.offsetTop,
          xOffset: e.evt.offsetX + offsetX,
          yOffset: e.evt.offsetY + offsetY,
        },
      };
    },
    onDragging(e) {
      const { elements } = this.$store.state.project;
      const projectElement = elements.filter((el) => (el.id === e.draggingProps.element.id))[0];
      const projectElementCopy = lodash.cloneDeep(projectElement);
      let update;
      if (e.draggingProps.dragType === 'translate') {
        update = {
          position: {
            x: projectElement.position.x + e.drag.x,
            y: projectElement.position.y + e.drag.y,
          },
        };
      } else if (e.draggingProps.dragType === 'rotate') {
        const dragAngle = parseInt(-(180 * e.drag.y) / 100, 10);
        // const atan = Math.atan2(20 - e.drag.y, e.drag.x);
        // const dragAngle = parseInt((-360 * atan) / (2 * Math.PI) + 90, 10);
        update = {
          rotation: ((projectElement.rotation || 0) + dragAngle) % 360,
        };
      } else if (e.draggingProps.dragType === 'scaleWidth') {
        const ratio = 2 ** (-e.drag.y / 100);
        update = {
          size: {
            width: Math.max(10, parseInt(ratio * projectElement.size.width, 10)),
          },
        };
      } else if (e.draggingProps.dragType === 'scaleHeight') {
        const ratio = 2 ** (-e.drag.y / 100);
        update = {
          size: {
            height: Math.max(10, parseInt(ratio * projectElement.size.height, 10)),
          },
        };
      } else if (e.draggingProps.dragType === 'scale') {
        // const ratio = (20 - e.drag.y) / 20;
        const ratio = 2 ** (-e.drag.y / 100);
        if (projectElement.type === 'asset' || projectElement.type === 'rectangle') {
          update = {
            size: {
              height: Math.max(10, parseInt(ratio * projectElement.size.height, 10)),
              width: Math.max(10, parseInt(ratio * projectElement.size.width, 10)),
              aspectRatio: projectElement.size.aspectRatio,
            },
          };
        } else if (projectElement.type === 'text') {
          update = {
            fontSize: Math.max(10, parseInt(ratio * projectElement.fontSize, 10)),
            stroke: {
              width: ratio * projectElement.stroke.width,
            },
          };
        }
      }
      this.dragModifiedElement = lodash.merge(projectElementCopy, update);
    },
    onDraggingStopped() {
      if (this.dragModifiedElement) {
        this.$store.commit('setEditorTabIndexToElementId', this.dragModifiedElement.id);
        this.updateElement({
          elementId: this.dragModifiedElement.id,
          update: this.dragModifiedElement,
        });
        this.dragModifiedElement = null;
      }
    },
  },
  computed: {
    dragModifiedProject() {
      const self = this;
      if (this.dragModifiedElement) {
        return {
          ...this.$store.state.project,
          elements: this.$store.state.project.elements.map((e) =>
            (e.id === self.dragModifiedElement.id ? self.dragModifiedElement : e)),
        };
      }
      return this.$store.state.project;
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
