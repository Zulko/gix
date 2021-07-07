<script>

export default {
  props: {
    element: { default: () => ({}), type: Object },
    infos: { default: () => ({}), type: Object },
    showOptions: { default: false, type: Boolean },
  },
  methods: {
    updateElement(update) {
      if ((update.size) && (this.element.editorSettings.isMainElement)) {
        const { width, height } = update.size;
        this.$store.commit('updateProject', { canvas: { width, height } });
        const position = { x: width / 2, y: height / 2 };
        const newUpdate = { ...update, position };
        this.$store.commit('updateElement', { elementId: this.element.id, update: newUpdate });
      } else {
        this.$store.commit('updateElement', { elementId: this.element.id, update });
      }
    },
  },
};
</script>
