<template lang='pug'>
.home-new-project
  h2 New project
  file-or-url-form(
    label="Start from a picture, GIF or video",
    @urlInput="handleUrl",
    @fileInput="handleFileInput",
    fileDescription="GIF/image/video",
    fileTip="Prefer URLs over uploads to make your projects easier to share"
  )
</template>
<script>
import { mapMutations } from 'vuex';
import { autoDetectedFrameServer } from '../../../gix-renderer/FrameServer/autoDetectedFrameServer';
import FileOrUrlForm from '../../../components/widgets/FileOrUrlForm.vue';

function generateRandomID() {
  /* eslint-disable */
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
  /* eslint-enable */
}

export default {
  data() {
    return {};
  },
  methods: {
    ...mapMutations(['setProject']),

    async handleUrl(urlData) {
      const server = await autoDetectedFrameServer(urlData);
      const sourceStats = await server.getInfos();
      const newProject = {
        infos: {
          gixVersion: '0.1.0',
          title: 'Unnamed Project',
          author: 'Anonymous gixer',
          tags: [],
        },
        canvas: {
          width: sourceStats.width,
          height: sourceStats.height,
          backgroundColor: '#000000',
        },
        isAnimated: server.type === 'gif' || server.type === 'video',
        duration: sourceStats.duration,
        fps: sourceStats.fps || 15,
        elements: [
          {
            id: generateRandomID(),
            editorSettings: {
              isMainElement: true,
              isDefaultFocus: false,
              isDraggable: false,
            },
            timeSegment: {
              start: 0,
              end: sourceStats.duration,
              alwaysShow: true,
            },
            position: {
              x: 0,
              y: 0,
              scale: 1,
              rotation: 0,
              isMoving: false,
              xAlign: 'left',
              yAlign: 'top',
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
          },
        ],
      };
      this.setProject(newProject);
      this.$router.push('editor');
    },
    handleFileInput() {},
  },
  components: {
    'file-or-url-form': FileOrUrlForm,
  },
};
</script>
<style lang='scss'>
.home-new-project {
  h2 {
    margin-top: 0;
  }
  .feeling-artsy {
    display: block;
    margin: 1em auto;
  }
}
</style>
