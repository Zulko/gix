<template lang="pug">
image.image-svg(:xlink:href="element.src",
                x="0", y="0"
                :height="element.size.height + 'px'",
                :width="element.size.width + 'px'")
</template>
<script>
export default {
  props: {
    element: {default: () => ({})}
  }
}
</script>
