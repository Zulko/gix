<script>
export default {
  props: {
    caption: {default: () => ({})}
  },
  methods: {
    updateCaption (update) {
      this.$store.commit('updateCaption', {captionId: this.caption.id, update})
    }
  }
}
</script>
