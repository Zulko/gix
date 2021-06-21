<template lang="pug">
.project-library
  h2 Projects in your library
  section.project-search-bar
    b-field(label="Search your projects by name or tags")
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
  b-carousel(
    v-model="carouselIndex",
    icon-prev="arrow-left",
    icon-next="arrow-right",
    :indicator-inside="true",
    :autoplay="false"
  )
    b-carousel-item(v-for="(project, i) in filteredProjects", :key="i")
      section
        p.gix-title {{ project.infos.title }}
        .gix-preview
          p.control.delete-button
            b-button(
              v-if="!builtinGixes.map((p) => p.infos.title).includes(project.infos.title)",
              size="is-small",
              @click="deleteProject(project.infos.title)",
              icon-left="delete"
            ) Delete this project
          .gix-clickable-screen(
            @click="handleClick(project)",
            :style="{ width: projectWidth(project) + 'px', height: projectHeight(project) + 'px' }"
          )
          gix-player(
            :project="project",
            v-if="carouselIndex === i",
            :params="{ scale: projectScale(project) }"
          )
</template>

<script>
import { mapMutations } from 'vuex';
import GixAnimationsCarousel from '../../../components/widgets/GixAnimationsCarousel.vue';
import GixPlayer from '../../../components/GixAnimation/GixPlayer.vue';
import keaton from './builtin-library-gixes/keaton-wind.json';
import chaplinForks from './builtin-library-gixes/chaplin-forks.json';
import fellowGixer from './builtin-library-gixes/fellow-gixer.json';
import multishrek from './builtin-library-gixes/multishrek.json';

export default {
  components: {
    'gix-animations-carousel': GixAnimationsCarousel,
    'gix-player': GixPlayer,
  },
  data() {
    return {
      searchTags: [],
      searchTerm: '',
      builtinGixes: [fellowGixer, multishrek, chaplinForks, keaton],
      carouselIndex: 0,
      maxProjectWidth: 800,
      maxProjectHeight: 500,
    };
  },
  computed: {
    filteredProjects() {
      const { searchTags } = this;
      const projects = [...Object.values(this.$store.state.savedProjects), ...this.builtinGixes];
      if (searchTags.length === 0) {
        return projects;
      }
      function score(p) {
        return [p.infos.title, ...p.infos.tags].filter((e) => searchTags.includes(e)).length;
      }
      const filteredProjects = projects.filter((project) => score(project) > 1);
      filteredProjects.sort((p1, p2) => (score(p1) < score(p2) ? -1 : 1));
      return filteredProjects;
    },
    filteredInputTags() {
      const projects = [...Object.values(this.$store.state.savedProjects), ...this.builtinGixes];
      const allTags = projects.reduce((tags, p) => ([...tags, ...p.infos.tags, p.infos.title]), []);
      const allUniqueTags = [...new Set(allTags)];
      if (!this.searchTerm.length) {
        return allUniqueTags;
      }
      return allUniqueTags.filter((n) => n.includes(this.searchTerm));
    },
  },
  methods: {
    ...mapMutations(['setProjectFromCopy', 'setEditorTabIndex', 'unsaveProject']),
    onTyping(string) {
      this.searchTerm = string;
    },
    handleClick(project) {
      this.setProjectFromCopy(project);
      this.setEditorTabIndex(project.elements.length - 1);
      this.$router.push('editor');
    },
    projectScale(project) {
      return Math.min(
        1,
        this.maxProjectWidth / project.canvas.width,
        this.maxProjectHeight / project.canvas.height,
      );
    },
    projectWidth(project) {
      return project.canvas.width * this.projectScale(project);
    },
    projectHeight(project) {
      return project.canvas.height * this.projectScale(project);
    },
    deleteProject(title) {
      const self = this;
      this.$buefy.dialog.confirm({
        message: `Deleting "${title}" cannot be undone. Are you sure you want to delete?`,
        onConfirm: () => { self.unsaveProject(title); },
      });
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
    position: relative;
    width: 90%;
    height: 400px;
    max-width: 800px;
    margin: 0 auto 0 auto;
    text-align: center;
    z-index: 0;
  }
  .gix-clickable-screen {
    cursor: pointer !important;
    position: absolute;
    display: block;
    z-index: 1;
    margin-left: auto;
    margin-right: auto;
    left: 0;
    right: 0;
    text-align: center;
  }
  .delete-button {
    position: absolute;
    bottom: 30px;
    right: 30px;
    z-index: 2;
  }
}
</style>
