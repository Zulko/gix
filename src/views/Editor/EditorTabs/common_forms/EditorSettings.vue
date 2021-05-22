<template lang="pug">
.editor-form
  .field
    b-switch(
        :value='element.editorSettings.isDraggable',
        @input='isDraggable=> (updateElement({editorSettings: {isDraggable}}))'
    ) Can be dragged in the player
  .field
    b-switch(
        :value='element.editorSettings.isDefaultFocus',
        @input='isDefaultFocus => (updateElement({editorSettings: {isDefaultFocus}}))'
    ) Focus on this element when opening the project
  .field(v-if='element.type === "asset"')
    b-switch(
        :value='element.editorSettings.isMainElement',
        @input='isMainElement=> (updateElement({editorSettings: {isMainElement}}))'
    ) This is the project's main (=background) element
</template>

<script>
import ElementComponentMixin from '../ElementComponentMixin.vue';

export default {
  extends: ElementComponentMixin,

};
</script>
