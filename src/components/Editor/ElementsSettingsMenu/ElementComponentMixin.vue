<script>
export default {
  props: {
    element: {default: () => ({})}
  },
  methods: {
    updateElement (update) {
      this.$store.commit('updateElement', {elementId: this.element.id, update})
    }
  }
}
</script>
