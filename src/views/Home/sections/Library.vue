<template lang="pug">
.project-library
  h2 Projects in your library
  section.project-search-bar
    b-field(label='Enter tags or project names')
      b-taginput(
        v-model='searchTags',
        :data='filteredInputTags',
        :autocomplete='true',
        :allow-new='false',
        :open-on-focus='true',
        field='user.first_name',
        icon='label',
        placeholder='tag or name',
        @typing='onTyping'
      )
  b-carousel(:indicator-inside='true', :autoplay='false')
    b-carousel-item(v-for='(project, i) in filteredProjects', :key='i')
      section
        p {{ project.name }}
</template>

<script>
import GixAnimationsCarousel from '../../../components/widgets/GixAnimationsCarousel.vue';

export default {
  components: {
    'gix-animations-carousel': GixAnimationsCarousel,
  },
  data() {
    return {
      searchTags: [],
      searchTerm: '',
      projects: [
        {
          name: 'Project 1',
          tags: ['dog'],
        },
        {
          name: 'Project 2',
          tags: ['cat'],
        },
        {
          name: 'Project 3',
          tags: ['mouse'],
        },
      ],
    };
  },
  computed: {
    filteredProjects() {
      return this.projects.filter((project) => {
        const { searchTags } = this;
        return [project.name, project.tags.concat()].every((e) => searchTags.includes(e));
      });
    },
    filteredInputTags() {
      const allTags = [];
      this.projects.forEach((project) => {
        allTags.push(project.name, ...project.tags);
      });
      return allTags;
    },
  },
  methods: {
    onTyping(string) {
      this.searchTerm = string;
    },
    handleClick() {},
  },
};
</script>

<style lang='scss' scoped>
</style>
