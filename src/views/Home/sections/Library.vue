<template lang="pug">
.project-library
  h2 Projects in your library
  section.project-search-bar
    b-field(label="Enter tags or project names")
      b-taginput(
        v-model="searchTags",
        :data="filteredInputTags",
        :autocomplete="true",
        :allow-new="false",
        :open-on-focus="true",
        field="user.first_name",
        icon="label",
        placeholder="tag or name",
        @typing="onTyping"
      )
  b-carousel(:indicator-inside="true", :autoplay="false")
    b-carousel-item(v-for="(project, i) in filteredProjects", :key="i")
      section
        p.gix-title {{ project.infos.title }}
        div(
          style="position: relative; width: 90%; max-width: 800px; margin: 0 auto 0 auto"
        )
          .gix-preview(
            style="position: absolute; width: 100%; height: 100%; display: block; z-index: 300",
            @click="handleClick(project)"
          )
          gix-player(:project="project")
</template>

<script>
import { mapMutations } from 'vuex';
import GixAnimationsCarousel from '../../../components/widgets/GixAnimationsCarousel.vue';
import GixPlayer from '../../../components/GixAnimation/GixPlayer.vue';

export default {
  components: {
    'gix-animations-carousel': GixAnimationsCarousel,
    'gix-player': GixPlayer,
  },
  data() {
    return {
      searchTags: [],
      searchTerm: '',
    };
  },
  computed: {
    filteredProjects() {
      const { searchTags } = this;
      const projects = Object.values(this.$store.state.savedProjects);
      if (searchTags.length === 0) {
        return projects;
      }
      return projects.filter(
        (project) =>
          [project.name, project.infos.tags.concat()].every((e) => searchTags.includes(e)), // eslint-disable-line
      );
    },
    filteredInputTags() {
      const projects = Object.values(this.$store.state.savedProjects);
      const allTags = [];
      projects.forEach((project) => {
        allTags.push(project.name, ...project.infos.tags);
      });
      return allTags;
    },
  },
  methods: {
    ...mapMutations(['setProjectFromCopy']),
    onTyping(string) {
      this.searchTerm = string;
    },
    handleClick(project) {
      this.setProjectFromCopy(project);
      this.$router.push('editor');
    },
  },
};
</script>

<style lang='scss'>
.project-library {
  p.gix-title {
    text-align: center;
    font-weight: bold;
    text-transform: capitalize;
  }
  .gix-preview {
    cursor: pointer !important;
  }
}
</style>
