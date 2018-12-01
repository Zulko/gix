<template lang="pug">
.emoji-picker
  el-tooltip(effect='light' placement='right-start', v-model='catalogVisible')
    .emojis-catalog-tooltip(slot='content')
      .emojis-search-input
        el-input(v-model='search')
      .search-results(v-if='search.length')
        div(v-if='searchResults.length')
          h5 Search results
          .group-emojis
            span.catalog-clickable-emoji(
                v-for='[emojiName, emoji] in searchResults',
                :key="'search-' + emojiName", @click="$emit('pick', emoji)"
                :title='emojiName') {{ emoji }}
        div(v-else)
          p.no-results (no results for your search)
      div(v-for='(emojiGroup, category) in emojisList', :key='category')
        h5 {{ category }}
        .group-emojis
          span.catalog-clickable-emoji(
            v-for='(emoji, emojiName) in emojiGroup',
            :key='emojiName', @click="$emit('pick', emoji)",
            :title='emojiName') {{ emoji }}
    .invoker
      span(v-if='catalogVisible') 😃
      span(v-else style='opacity: 0.75; font-size: 0.9em;') 😊
</template>

<script>
import emojisList from 'vue-emoji-picker/src/emojis.js'
export default {
  data () {
    return {
      search: '',
      emojisList: emojisList,
      catalogVisible: false
    }
  },
  methods: {
    append (emoji) {
      this.input += emoji
    }
  },
  computed: {
    searchResults () {
      console.log('searching')
      var search = this.search
      return [].concat(...Object.values(this.emojisList).map(function (group) {
        return Object.entries(group).filter(e => e[0].indexOf(search) > -1)
      }))
    }
  }
}
</script>

<style lang='scss'>
.emoji-picker > .invoker {
  cursor: pointer;
  position: absolute;
  top: 6px;
  right: 6px;
}
.emoji-picker {
  font-size: 22px;
}
.emojis-catalog-tooltip {
  font-family: 'Permanent Marker', Raleway, Arial;
  width: 240px;
  max-height: 300px;
  overflow-y: scroll;
  font-size: 22px;
  .emojis-search-input {
    margin-left:10%;
    margin-right:10%;
  }
  h5 {
    text-align: center;
    margin-bottom: 3mm;
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
}

</style>
