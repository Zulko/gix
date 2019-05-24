<script>
export default {
  props: {
    element: {default: () => ({})},
    infos: {default: () => ({})},
    showOptions: {default: false}
  },
  methods: {
    updateElement (update) {
      this.$store.commit('updateElement', {elementId: this.element.id, update})
    }
  }
}
</script>
