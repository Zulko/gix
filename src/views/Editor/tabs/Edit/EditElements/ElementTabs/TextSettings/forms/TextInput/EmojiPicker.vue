<template lang="pug">
.emoji-picker
  .emojis-search-input
    b-field
      b-input(v-model='search' placeholder='Search for emojis')

  .emoji-list
    .search-results(v-if='search.length')
      div(v-if='searchResults.length')
        h5 Search results
        .group-emojis
          span.catalog-clickable-emoji(
              v-for='[emojiName, emoji] in searchResults',
              :key="'search-' + emojiName",
              @click="updateElement({text: element.text + emoji})"
              :title='emojiName') {{ emoji }}
      div(v-else)
        p.no-results (no results for your search)
    div(v-for='(emojiGroup, category) in emojisList', :key='category')
      h5 {{ category }}
      .group-emojis
        .catalog-clickable-emoji(
          v-for='(emoji, emojiName) in emojiGroup',
          :key='emojiName',
          @click="updateElement({text: element.text + emoji})",
          :title='emojiName'
        ) {{ emoji }}

</template>

<script>
import emojisList from 'vue-emoji-picker/src/emojis';
import ElementComponentMixin from '../../../ElementComponentMixin.vue';

export default {
  extends: ElementComponentMixin,
  data() {
    return {
      search: '',
      emojisList,
      catalogVisible: false,
    };
  },
  methods: {
    append(emoji) {
      this.input += emoji;
    },
    closeCatalog() {
      console.log('bla'); //eslint-disable-line
      this.catalogVisible = false;
    },
  },
  computed: {
    searchResults() {
      const { search } = this;
      return [].concat(...Object.values(this.emojisList).map(
        (group) => Object.entries(group).filter((e) => e[0].indexOf(search) > -1),
      ));
    },
  },
};
</script>

<style lang='scss'>
.emoji-picker {
  font-family: 'Permanent Marker', Raleway, Arial;
  font-size: 22px;
  max-width: 100%;
  margin: 1em auto;
  .emojis-search-input {
    margin-left:10%;
    margin-right:10%;
    margin-bottom: 1em;
  }
  .emoji-list {
    max-height: 300px;
    overflow-y: scroll;
    text-align: center;
    padding-left: 5%;
    padding-right: 5%;
    margin-bottom: 2em;
  }
  h5 {
    text-align: center;
    margin-bottom: 3mm;
    font-family: 'Caveat Brush';
  }
  p.no-results {
    text-align: center;
    color: grey;
    font-family: Raleway;
    font-size: 14px;
  }
  .catalog-clickable-emoji {
    margin: 2px;
    cursor: pointer;
  }
  .catalog-clickable-emoji {
    display: inline-block;
  }
}

</style>
