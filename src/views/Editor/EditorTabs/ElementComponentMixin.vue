<script>

export default {
  props: {
    element: { default: () => ({}), type: Object },
    infos: { default: () => ({}), type: Object },
    showOptions: { default: false, type: Boolean },
  },
  methods: {
    updateElement(update) {
      this.$store.commit('updateElement', { elementId: this.element.id, update });
    },
  },
};
</script>
