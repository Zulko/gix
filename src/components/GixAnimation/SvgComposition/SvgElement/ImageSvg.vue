<template lang="pug">
image.image-svg(:xlink:href="element.src",
                :height="element.size.height",
                :width="element.size.width")
</template>
<script>
export default {
  props: {
    element: {default: () => ({})}
  }
}
</script>
