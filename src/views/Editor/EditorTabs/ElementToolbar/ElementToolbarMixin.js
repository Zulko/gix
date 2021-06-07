import { mapMutations } from 'vuex';

export default {
  methods: {
    ...mapMutations([
      'duplicateElement',
      'deleteElement',
      'moveElementUp',
      'moveElementDown',
    ]),
    moveElementUpAndUpdate() {
      const index = this.$store.state.project.elements
        .map((c) => c.id)
        .indexOf(this.elementId);
      if (index < this.$store.state.project.elements.length) {
        this.moveElementUp(this.elementId);
      }
    },
    moveElementDownAndUpdate() {
      const index = this.$store.state.project.elements
        .map((c) => c.id)
        .indexOf(this.elementId);
      if (index > 0) {
        this.moveElementDown(this.elementId);
      }
    },
  },
};
