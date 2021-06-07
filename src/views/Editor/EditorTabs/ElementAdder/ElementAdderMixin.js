import { mapMutations } from 'vuex';
import elementGenerators from './elementsGenerators';
import AssetAddingModal from './AssetAddingModal.vue';

export default {
  data() {
    return {
      dialogIsVisible: false,
    };
  },
  components: {
    'asset-adding-modal': AssetAddingModal,
  },
  methods: {
    ...mapMutations(['addElement']),
    addText(position) {
      this.addElement(
        elementGenerators.newText(this.$store.state.project, position),
      );
    },
    addRectangle(position) {
      this.addElement(
        elementGenerators.newRectangle(this.$store.state.project, position),
      );
    },
  },
};
