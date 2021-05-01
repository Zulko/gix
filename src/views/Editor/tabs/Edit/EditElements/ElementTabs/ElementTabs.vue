<template lang="pug">
b-tabs.element-tabs(tab-position='top' :multiline='true', :animated='false')
  b-tab-item.element-tab-pane(
    v-for='element, i in $store.state.project.elements',
    :key='element.id',
    :name='element.id'
  )
    template(slot='header')
      span.tab-text-label(
        v-if="element.type == 'text'",
        :style="{'font-family': element.font.family}"
      ) {{tabLabel(element.text)}}
      img.tab-img-label(v-if="element.type == 'asset'" :src="element.url")
    element-toolbar(:elementId='element.id')
    .element-settings(
      :is='settingsComponents[element.type]',
      :element='element',
      :showOptions='i === currentCarouselIndex'
    )
  b-tab-item.element-adder(key="adder" icon='plus-circle-outline' label='New element')
    element-adder
  b-tab-item.element-adder(key="settings" icon='cog' label='Project settings')
    settings-tab
</template>

<script>
import { mapMutations } from 'vuex';
import ElementSettings from './ElementSettings.vue';
import TextSettings from './TextSettings/TextSettings.vue';
import AssetSettings from './AssetSettings/AssetSettings.vue';
import ElementAdder from './ElementAdder.vue';
import ElementToolbar from './ElementToolbar.vue';
import SettingsTab from './SettingsTab.vue';

// TODO: deleting an element tab should bring to the next element tab.
export default {
  data() {
    return {
      currentCarouselIndex: 0,
      settingsComponents: {
        text: TextSettings,
        asset: AssetSettings,
      },
    };
  },
  components: {
    'element-settings': ElementSettings,
    'element-adder': ElementAdder,
    'element-toolbar': ElementToolbar,
    'settings-tab': SettingsTab,

  },
  methods: {
    ...mapMutations([
      'duplicateElement',
      'deleteElement',
      'moveElementUp',
      'moveElementDown',
    ]),
    tabLabel(label) {
      return (label.length > 7 ? `${label.slice(0, 7)}…` : label);
    },
  },
};
</script>

<style lang='scss'>
.element-tabs {
  .tab-text-label {
    max-width: 4em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  img.tab-img-label {
    max-height: 1.8em;
    margin: 0 auto -0.3em;
  }
}
</style>
