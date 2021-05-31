<template lang="pug">
b-tabs.element-tabs(
  :key="$store.state.project.elements.map((e) => e.id).join()",
  tab-position="top",
  :multiline="true",
  :animated="false",
  v-model="tabIndex"
)
  b-tab-item.element-adder(key="settings", label="Project settings")
    settings-tab
  b-tab-item.element-adder(key="export", label="Export GIF")
    export-gif
  b-tab-item.element-adder(key="save", label="Save & Share")
    save-and-share
  b-tab-item.element-adder(
    key="adder",
    icon="plus-circle-outline",
    label="New element"
  )
    element-adder
  b-tab-item.element-tab-pane(
    v-for="(element, i) in $store.state.project.elements",
    :key="element.id",
    :name="element.id"
  )
    template(slot="header")
      span.tab-text-label(
        v-if="element.type == 'text'",
        :style="{ 'font-family': element.font.family }"
      ) {{ tabLabel(element.text) }}
      img.tab-img-label(
        v-if="['gif', 'image'].includes(element.subtype)",
        :src="element.url"
      )
      span.tab-video-label(v-if="element.subtype == 'video'")
        b-icon(icon="movie")
        | {{ element.title ? tabLabel(element.title) : '' }}
      span.tab-rectangle-label(v-if="element.subtype == 'rectangle'")
        svg(
          viewBox="0 0 12 12",
          xmlns="http://www.w3.org/2000/svg",
          style="width: 25px; height: 25px; margin-bottom: -5px"
        )
          rect(
            x="2",
            y="2",
            width="9",
            height="9",
            rx="2",
            ry="2",
            :fill="element.color.toLowerCase()",
            stroke="grey",
            style="stroke-width: 1"
          )
    element-toolbar(:elementId="element.id")
    .element-settings(
      :is="settingsComponents[element.type]",
      :element="element",
      :showOptions="i === tabIndex"
    )
</template>

<script>
import { mapMutations } from 'vuex';
import ElementSettings from './EditorTabs/ElementSettings.vue';
import TextSettings from './EditorTabs/TextSettings/TextSettings.vue';
import RectangleSettings from './EditorTabs/RectangleSettings/RectangleSettings.vue';
import AssetSettings from './EditorTabs/AssetSettings/AssetSettings.vue';
import ElementAdder from './EditorTabs/ElementAdder.vue';
import ElementToolbar from './EditorTabs/ElementToolbar.vue';
import SettingsTab from './EditorTabs/SettingsTab.vue';
import ExportGif from './EditorTabs/ExportGif.vue';
import SaveAndShare from './EditorTabs/SaveAndShare.vue';

// TODO: deleting an element tab should bring to the next element tab.
export default {
  data() {
    return {
      settingsComponents: {
        text: TextSettings,
        asset: AssetSettings,
        rectangle: RectangleSettings,
      },
    };
  },
  components: {
    'element-settings': ElementSettings,
    'element-adder': ElementAdder,
    'element-toolbar': ElementToolbar,
    'settings-tab': SettingsTab,
    'export-gif': ExportGif,
    'save-and-share': SaveAndShare,
  },
  computed: {
    tabIndex: {
      get() {
        return this.$store.state.globals.activeEditorElementTab + 4;
      },
      set(val) {
        this.$store.commit('setEditorTabIndex', val - 4);
      },
    },
  },
  methods: {
    ...mapMutations(['duplicateElement', 'deleteElement', 'moveElementUp', 'moveElementDown']),
    tabLabel(label) {
      return label.length > 7 ? `${label.slice(0, 7)}…` : label;
    },
  },
};
</script>

<style lang='scss'>
.element-tabs {
  margin: 0 auto;
  width: 90%;
  .tab-text-label {
    max-width: 4em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .tab-video-label {
    max-width: 8em;
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