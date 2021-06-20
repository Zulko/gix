<template lang="pug">
.crop-asset-preview
  gix-frame-display(
    :project="project",
    v-if="project",
    @dragging="onDragging",
    @draggingStopped="onDraggingStopped",
    :time="time"
  )
  b-slider.preview-slider(
    v-model="time",
    :min="0",
    :max="this.assetStats.duration",
    :step="0.1",
    :style="{ width: timeCropSliderWidth + 'px' }"
  )
  b-field.image-crop-form(
    grouped,
    group-multiline,
    label="Crop",
    v-if="element.crop"
  )
    p.control(v-for="direction in ['top', 'bottom', 'left', 'right']")
      b-field(:label="direction", label-position="on-border")
        b-numberinput.number-input(
          size="mini",
          controls-position="compact",
          :min="0",
          :value="element.crop[direction]",
          @input="(v) => updateCrop(v, direction)"
        )
</template>

<script>
import { mapMutations } from 'vuex';
import lodash from 'lodash';
import GixFrameDisplay from '../../../../../../components/GixAnimation/GixFrameDisplay.vue';
import ElementComponentMixin from '../../../ElementComponentMixin.vue';

function updateCropInSingleDirection(element, direction, v, assetStats) {
  const oldValue = element.crop[direction];
  const change = v - oldValue;
  if (!change) {
    return element;
  }
  const data = { crop: {} };
  data.crop[direction] = v;
  if (direction === 'top' || direction === 'bottom') {
    const currentHeight =
      assetStats.height - element.crop.top - element.crop.bottom;
    const propHeightChange = change / currentHeight;
    data.size = {
      height: Math.round(element.size.height * (1 - propHeightChange)),
      aspectRatio: element.size.aspectRatio / (1 - propHeightChange),
    };
  } else {
    const currentWidth =
      assetStats.width - element.crop.left - element.crop.right;
    const propWidthChange = change / currentWidth;
    data.size = {
      width: Math.round(element.size.width * (1 - propWidthChange)),
      aspectRatio: element.size.aspectRatio * (1 - propWidthChange),
    };
  }
  return lodash.merge(lodash.cloneDeep(element), data);
}

function updateElementCrop(element, crop, assetStats) {
  return Object.keys(crop).reduce(
    (e, direction) =>
      updateCropInSingleDirection(e, direction, crop[direction] || 0, assetStats),
    element,
  );
}

export default {
  extends: ElementComponentMixin,
  data() {
    return {
      dragModifiedElement: null,
      time: 0,
    };
  },
  components: {
    'gix-frame-display': GixFrameDisplay,
  },
  computed: {
    assetStats() {
      return this.$store.state.assetStats[this.element.id];
    },
    project() {
      const element = this.dragModifiedElement || this.element;
      const { assetStats } = this;
      if (!assetStats) {
        return null;
      }
      return {
        canvas: {
          width: assetStats.width,
          height: assetStats.height,
          backgroundColor: '#000000',
        },
        elements: [
          {
            ...element,
            editorSettings: {
              isMainElement: false,
              isDraggable: false,
            },
            opacity: 0.2,
            position: {
              x: 0,
              y: 0,
              scale: 1,
              rotation: 0,
              isMoving: false,
              xAlign: 'left',
              yAlign: 'top',
            },
            timeSegment: {
              start: 0,
              end: assetStats.duration,
            },
            crop: {
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
            },
            size: {
              width: assetStats.width,
              height: assetStats.height,
            },
          },
          {
            ...element,
            ...this.croppedPosition,
            editorSettings: {
              isMainElement: false,
              isDraggable: false,
            },
          },
          {
            id: 2,
            type: 'rectangle',
            subtype: 'rectangle',
            color: '#00000001',
            ...this.croppedPosition,
            stroke: {
              width: 2,
              color: '#000000',
            },
            timeSegment: {
              start: 0,
              end: assetStats.duration,
            },
            roundedCorners: {
              rx: 0,
              ry: 0,
            },
            editorSettings: {
              isMainElement: false,
              isDraggable: true,
            },
            nonRotatable: true,
          },
        ],
      };
    },
    croppedPosition() {
      const element = this.dragModifiedElement || this.element;
      const { assetStats } = this;
      if (!assetStats || !element) {
        return null;
      }
      return {
        position: {
          x: (element.crop.left + assetStats.width - element.crop.right) / 2,
          y: (element.crop.top + assetStats.height - element.crop.bottom) / 2,
          scale: 1,
          rotation: 0,
          isMoving: false,
          xAlign: 'center',
          yAlign: 'center',
        },
        timeSegment: {
          start: 0,
          end: assetStats.duration,
        },
        editorSettings: {
          isMainElement: false,
          isDraggable: false,
        },
        size: {
          width: assetStats.width - element.crop.left - element.crop.right,
          height: assetStats.height - element.crop.bottom - element.crop.top,
        },
      };
    },
    timeCropSliderWidth() {
      const previewWidth = this.assetStats.width;
      return Math.min(800, Math.max(this.assetStats.duration * 100, previewWidth));
    },
  },
  methods: {
    ...mapMutations(['updateElement', 'updateProject']),
    onDragging(e) {
      const { element } = e.draggingProps;
      const { drag } = e;
      const assetStats = this.$store.state.assetStats[this.element.id];
      let crop;
      if (e.draggingProps.dragType === 'translate') {
        crop = {
          left: Math.max(0, element.position.x - 0.5 * element.size.width + drag.x),
          top: Math.max(0, element.position.y - 0.5 * element.size.height + drag.y),
        };
        crop = {
          ...crop,
          right: Math.max(
            0,
            assetStats.width - element.position.x - drag.x - 0.5 * element.size.width,
          ),
          bottom: Math.max(
            0,
            assetStats.height - element.position.y - drag.y - 0.5 * element.size.height,
          ),
        };
      } else if (e.draggingProps.dragType === 'scaleWidth') {
        const ratio = 2 ** (-drag.y / 100);
        const newWidth = element.size.width * ratio;
        const left = Math.max(element.position.x - newWidth / 2, 0);
        const right = Math.max(0, assetStats.width - element.position.x - newWidth / 2);
        const top = element.position.y - element.size.height / 2;
        const bottom = assetStats.height - (element.position.y + element.size.height / 2);
        crop = {
          left, right, top, bottom,
        };
      } else if (e.draggingProps.dragType === 'scaleHeight') {
        const ratio = 2 ** (-drag.y / 100);
        const newHeight = element.size.height * ratio;
        const left = element.position.x - element.size.width / 2;
        const right = assetStats.width - (element.position.x + element.size.width / 2);
        const top = Math.max(element.position.y - newHeight / 2, 0);
        const bottom = Math.max(0, assetStats.height - element.position.y - newHeight / 2);
        crop = {
          left, right, top, bottom,
        };
      }
      this.dragModifiedElement = updateElementCrop(this.element, crop, assetStats);
    },
    onDraggingStopped() {
      if (this.dragModifiedElement) {
        this.updateElement({
          elementId: this.dragModifiedElement.id,
          update: this.dragModifiedElement,
        });
        if (this.element.editorSettings.isMainElement) {
          const canvas = {
            width: this.dragModifiedElement.size.width,
            height: this.dragModifiedElement.size.height,
          };
          this.updateProject({ canvas });
        }
        this.dragModifiedElement = null;
      }
    },
  },
  watch: {
    'element.timeCrop': {
      deep: true,
      handler(val, oldVal) {
        if (val.end !== oldVal.end) {
          this.time = val.end;
        }
        if (val.start !== oldVal.start) {
          this.time = val.start;
        }
      },
    },
  },
};
</script>

<style lang="scss">
.crop-asset-preview {
  .number-input {
    width: 150px;
  }
  .preview-slider {
    margin: 0 auto;
  }
}
</style>
