<template lang="pug">
.element-adder
  section.section
    .buttons(style="width: 300px; margin: 0 auto")
      b-button.is-fullwidth(
        @click="addElement('text')",
        icon-left="format-font",
        round
      ) New text
      b-button.is-fullwidth(
        @click="dialogIsVisible = true",
        icon-left="image",
        round
      ) New GIF/pic/video
      b-button.is-fullwidth(
        @click="addElement('rectangle')",
        icon-left="rectangle-outline",
        round
      ) New rectangle
  b-modal(
    v-model="dialogIsVisible",
    has-modal-card,
    trap-focus,
    :destroy-on-hide="false",
    aria-role="dialog",
    aria-modal
  )
    form(action="")
      .modal-card(style="width: auto")
        header.modal-card-head
          p.modal-card-title(style="font-family: 'Caveat Brush'") Add a new GIF/Picture/Video
        section.modal-card-body
          file-or-url-form(
            label="GIF/Image/Video URL or file",
            @urlInput="handleUrlInput",
            @fileInput="handleFileInput"
          )
</template>
<script>
import { mapMutations } from 'vuex';
import FileOrUrlFormVue from '../../../components/widgets/FileOrUrlForm.vue';
import { autoDetectedFrameServer } from '../../../gix-renderer/FrameServer/autoDetectedFrameServer';

function generateID(elements, offset = 0) {
  const suggestedId = `element-${offset}`;
  if (elements.some((e) => e.id === suggestedId)) {
    return generateID(elements, offset + 1);
  }
  return suggestedId;
}
export default {
  data() {
    return {
      dialogIsVisible: false,
    };
  },
  components: {
    'file-or-url-form': FileOrUrlFormVue,
  },
  methods: {
    ...mapMutations(['addElement']),
    async handleUrlInput(urlData) {
      this.dialogIsVisible = false;
      try {
        const server = await autoDetectedFrameServer(urlData);
        console.log(server);
        const sourceStats = await server.getInfos();
        const currentElements = this.$store.state.project.elements;
        const newElement = {
          id: generateID(currentElements),
          editorSettings: {
            isMainElement: false,
            isDefaultFocus: false,
            isDraggable: true,
          },
          timeSegment: {
            start: 0,
            end: sourceStats.duration,
            alwaysShow: true,
          },
          position: {
            x: this.$store.state.project.canvas.width / 2,
            y: this.$store.state.project.canvas.height / 2,
            scale: 1,
            rotation: 0,
            isMoving: false,
            xAlign: 'center',
            yAlign: 'center',
          },
          stroke: {
            width: 1,
            color: '#000000',
          },
          type: 'asset',
          subtype: server.type,
          ...urlData,
          size: {
            width: sourceStats.width,
            height: sourceStats.height,
            aspectRatio: sourceStats.width / sourceStats.height,
          },
          crop: {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
          },
          timeCrop: {
            start: 0,
            end: sourceStats.duration,
          },
          speedFactor: 1.0,
        };
        this.$store.commit('updateProject', { elements: [...currentElements, newElement] });
      } catch (err) {
        console.error(err);
        this.$buefy.toast.open({
          message: 'Something wrong happened. Check the URL and try again',
          type: 'is-danger',
        });
      }
    },
    handleFileInput() {},
  },
};
</script>
<style lang="scss">
.element-adder {
  .adder-button {
    margin-top: 1em;
    text-align: left;
    display: block;
    background: none;
  }
  .icon-container {
    height: 10px;
  }
}
</style>
