<template lang="pug">
.clickable-layer(@click='handleClick')
</template>

<script>
export default {
  props: {
    clickMode: {default: () => ({})},
    lastFrame: {default: () => ({})},
    currentTime: {default: () => 0}
  },
  data () {
    return {
      previousClickTime: null
    }
  },
  methods: {
    handleClick (e) {
      console.log('e')
      var clickStats = {
        position: {
          x: e.offsetX, // e.pageX - e.target.offsetLeft,
          y: e.offsetY // e.pageY - e.target.offsetTop
        },
        time: (this.currentTime - 0.01).toFixed(2)
      }
      switch (this.clickMode.mode) {
        case 'none':
          return this.handleDisplayStatsClick(clickStats)
        case 'position':
          return this.handlePositionClick(clickStats)
        case 'timeSegment':
          return this.handleTimeSegmentClick(clickStats)
      }
    },
    handleDisplayStatsClick (clickStats) {
      var message = `&#x1f4cc; ${clickStats.position.x} - ${clickStats.position.y}
                      <br/>&#x231b; ${clickStats.time}`
      this.$notify({
        duration: 0,
        title: null,
        dangerouslyUseHTMLString: true,
        message: `<p style='display: inline-block; vertical-align: top'>${message}</p>`
      })
      this.previousClickTime = null
    },
    handlePositionClick (clickStats) {
      this.$store.commit('updateElement', {
        elementId: this.clickMode.element.id,
        update: {position: clickStats.position}
      })
      this.previousClickTime = null
      this.$store.commit('updateGlobals', {'gifClickMode': {mode: 'none'}})
    },
    handleTimeSegmentClick (clickStats) {
      if (this.previousClickTime) {
        var maxTime = this.$store.state.project.duration
        this.$store.commit('updateElement', {
          elementId: this.clickMode.element.id,
          update: {
            timeSegment: {
              start: this.previousClickTime,
              end: this.previousClickTime < clickStats.time ? clickStats.time : maxTime
            }
          }
        })
        this.previousClickTime = null
        this.$store.commit('updateGlobals', {'gifClickMode': {mode: 'none'}})
      } else {
        this.previousClickTime = clickStats.time
      }
    }
  }
}
</script>

<style lang='scss'>
.clickable-layer {
  cursor: pointer;
}
</style>
