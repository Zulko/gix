<template lang="pug">
.undo-redo-widget
  b-button(
    size="is-small",
    icon-left="undo",
    @click="undo()",
    :disabled="!done.length"
  ) Undo
  b-button(
    size="is-small",
    icon-left="redo",
    @click="redo()",
    :disabled="!undone.length"
  ) Redo
</template>

<script>
import { cloneDeep } from 'lodash';

export default {
  data() {
    return {
      done: [],
      undone: [],
      newMutation: true,
      registered: false,
      projectAtMountTime: {},
      mutationsList: [
        'setProject',
        'moveElementDown',
        'moveElementUp',
        'deleteElement',
        'duplicateElement',
        'addElement',
        'updateElement',
        'updateProject',
      ],
    };
  },
  mounted() {
    this.projectAtMountTime = cloneDeep(this.$store.state.project);
    const self = this;
    this.$store.subscribe((mutation) => {
      if (self.mutationsList.includes(mutation.type)) {
        self.done = [...self.done, mutation];
        if (self.newMutation) {
          self.undone = [];
        }
      }
    });
  },
  methods: {
    redo() {
      const undone = [...this.undone];
      const commit = undone.pop();
      this.undone = undone;
      this.newMutation = false;
      this.$store.commit(`${commit.type}`, commit.payload);
      this.newMutation = true;
    },
    undo() {
      const self = this;
      const done = [...this.done];
      const commit = done.pop();
      this.undone = [...this.undone, commit];
      this.newMutation = false;
      this.$store.commit('setProjectFromCopy', this.projectAtMountTime);
      done.forEach((mutation) => {
        self.$store.commit(mutation.type, mutation.payload);
      });
      this.done = done;
      this.newMutation = true;
    },
  },
};
</script>
