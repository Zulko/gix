<template lang='pug'>
.home-new-project
  h2 New project from a GIF, video or picture
  file-or-url-form(
    @urlInput="handleUrl",
    fileDescription="GIF/image/video",
    fileTip="Prefer URLs over uploads to make your projects easier to share"
  )
</template>
<script>
import { mapMutations } from 'vuex';
import { autoDetectedFrameServer } from '../../../gix-renderer/FrameServer/autoDetectedFrameServer';
import FileOrUrlForm from '../../../components/widgets/FileOrUrlForm.vue';

export default {
  data() {
    return {};
  },
  methods: {
    ...mapMutations(['setProject', 'setEditorTabIndex']),

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
            id: 'asset-01',
            editorSettings: {
              isMainElement: true,
              isDraggable: false,
            },
            timeSegment: {
              start: 0,
              end: sourceStats.duration,
              alwaysShow: true,
            },
            position: {
              x: sourceStats.width / 2,
              y: sourceStats.height / 2,
            },
            rotation: 0,
            xAlign: 'center',
            yAlign: 'center',
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
            opacity: 1,
          },
        ],
      };
      this.setProject(newProject);
      this.setEditorTabIndex(0);
      this.$router.push('editor');
    },
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
