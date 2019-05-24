<template lang="pug">
.share-project-form
  p
    el-input(v-model='title', size='small')
  p
    el-tooltip(content="Save the project in your browser so you can continue it later"
               placement='right')
      el-button(size='mini', @click="downloadProjectJson") Save project locally
  p
    el-tooltip(content="Download your project as a JSON file"
               placement='right')
      el-button(size='mini', @click="downloadProjectJson") Download Project
  p
    el-tooltip(content="Create a direct link to share your project on the web"
               placement='right')
      el-button(size='mini', @click="createDirectLink") Create a web link
  .web-link-fields(v-if='url')
    p Created a {{url.length}}-character link.<br/>Copy to clipboard as:

    p.clipboard-link(v-for='mode in urlModes', :key='mode',
                     @click="copyUrlToClipboard(mode)") {{ mode }}

</template>

<script>
import downloadjs from 'downloadjs'
import tools from '../../../../tools'
import pako from 'pako'
import { mapMutations } from 'vuex'

export default {
  data () {
    return {
      url: null,
      urlModes: ['URL', 'Markdown']
    }
  },
  computed: {
    title: {
      get () {
        if (this.$store.state.project.infos) {
          return this.$store.state.project.infos.title
        } else {
          return 1
        }
      },
      set (value) {
        this.$store.commit('updateProject', {infos: {title: value}})
      }
    }
  },
  methods: {
    ...mapMutations([
      'updateProject'
    ]),
    downloadProjectJson () {
      var project = this.$store.state.project
      var projectJSON = JSON.stringify(project, null, 2)
      downloadjs(projectJSON, project.infos.title + '.json', 'application/json')
    },
    async createDirectLink () {
      var project = this.$store.state.project
      var compressed = pako.deflate(JSON.stringify(project), { to: 'string' })
      this.url = 'https://gix.it?data=' + btoa(compressed)
    },
    copyUrlToClipboard (mode) {
      var links = {
        URL: this.url,
        Markdown: `[${this.$store.state.project.infos.title}](${this.url})`
      }
      tools.copyStrToClipboard(links[mode])
      this.$notify({
        duration: 3000,
        title: 'Copied',
        message: `The ${mode} has been copied to your clipboard`
      })
    }
  }
}
</script>

<style lang='scss'>
.share-project-form {
  text-align: center;
  .clipboard-link {
    color: #0e84ffff;
    cursor: pointer;
  }
}
</style>
