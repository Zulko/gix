<template lang='pug'>
.editor-gix-player
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
  undo-redo-widget(style="text-align: left; margin-left: 2em")
</template>
<script>
import { mapMutations } from 'vuex';
import lodash from 'lodash';
import GixPlayer from '../../components/GixAnimation/GixPlayer.vue';
import UndoRedoWidget from '../../components/UndoRedoWidget.vue';
import GixContextMenu from './GixContextMenu.vue';
import EditorTabs from './EditorTabs.vue';
import { resolveElement } from '../../gix-renderer/index';

export default {
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
      timeDragStarted: null,
    };
  },
  components: {
    'gix-player': GixPlayer,
    'editor-tabs': EditorTabs,
    'undo-redo-widget': UndoRedoWidget,
    'gix-context-menu': GixContextMenu,
  },
  methods: {
    ...mapMutations(['updateElement']),
    closeMenu() {
      this.contextMenu = { ...this.contextMenu, isVisible: false };
    },
    onContextMenu(e) {
      this.contextMenu = {
        isVisible: true,
        element: e.element,
        position: {
          x: e.evt.pageX - this.$el.offsetLeft,
          y: e.evt.pageY - this.$el.offsetTop,
          xOffset: e.svgX,
          yOffset: e.svgY,
        },
      };
    },
    onDragging(e) {
      if (this.timeDragStarted === null) {
        this.timeDragStarted = Math.round(100 * e.t) / 100;
      }
      const { elements } = this.$store.state.project;
      const projectElement = elements.filter((el) => (el.id === e.draggingProps.element.id))[0];
      const resolvedElement = resolveElement(projectElement, { time: this.timeDragStarted });
      const projectElementCopy = lodash.cloneDeep(projectElement);
      const update = this.computeDraggingUpdate(e, resolvedElement);
      this.dragModifiedElement = this.transformDraggedElementWithUpdate(projectElementCopy, update);
    },
    transformDraggedElementWithUpdate(projectElementCopy, update) {
      const [updatedProp] = Object.keys(update);
      const { timeVariable } = projectElementCopy[updatedProp];
      if (!timeVariable) {
        return lodash.merge(projectElementCopy, update);
      }
      const self = this;
      const newTimeVariable = timeVariable.filter((e) => e.t !== self.timeDragStarted);
      newTimeVariable.push({ t: this.timeDragStarted, value: update[updatedProp] });
      newTimeVariable.sort((a, b) => (a.t > b.t ? 1 : -1));
      return {
        ...projectElementCopy,
        [updatedProp]: {
          timeVariable: newTimeVariable,
        },
      };
    },
    computeDraggingUpdate(e, projectElement) {
      if (e.draggingProps.dragType === 'translate') {
        return {
          position: {
            x: parseInt(projectElement.position.x + e.drag.x, 10),
            y: parseInt(projectElement.position.y + e.drag.y, 10),
          },
        };
      } if (e.draggingProps.dragType === 'rotate') {
        const dragAngle = parseInt(-(180 * e.drag.y) / 100, 10);
        return {
          rotation: ((projectElement.rotation || 0) + dragAngle) % 360,
        };
      } if (e.draggingProps.dragType === 'scaleWidth') {
        const ratio = 2 ** (-e.drag.y / 100);
        return {
          size: {
            width: Math.max(10, parseInt(ratio * projectElement.size.width, 10)),
          },
        };
      } if (e.draggingProps.dragType === 'scaleHeight') {
        const ratio = 2 ** (-e.drag.y / 100);
        return {
          size: {
            height: Math.max(10, parseInt(ratio * projectElement.size.height, 10)),
          },
        };
      } if (e.draggingProps.dragType === 'scale') {
        // const ratio = (20 - e.drag.y) / 20;
        const ratio = 2 ** (-e.drag.y / 100);
        if (projectElement.type === 'asset' || projectElement.type === 'rectangle') {
          return {
            size: {
              height: Math.max(10, parseInt(ratio * projectElement.size.height, 10)),
              width: Math.max(10, parseInt(ratio * projectElement.size.width, 10)),
              aspectRatio: projectElement.size.aspectRatio,
            },
          };
        } if (projectElement.type === 'text') {
          return {
            fontSize: Math.max(10, parseInt(ratio * projectElement.fontSize, 10)),
            stroke: {
              width: ratio * projectElement.stroke.width,
            },
          };
        }
      }
      return {};
    },
    onDraggingStopped() {
      if (this.dragModifiedElement) {
        this.$store.commit('setEditorTabIndexToElementId', this.dragModifiedElement.id);
        this.updateElement({
          elementId: this.dragModifiedElement.id,
          update: this.dragModifiedElement,
        });
        this.dragModifiedElement = null;
        this.timeDragStarted = null;
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
};
</script>
