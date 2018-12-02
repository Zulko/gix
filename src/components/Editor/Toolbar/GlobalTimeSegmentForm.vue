<template lang="pug">
el-slider(:value='[$store.state.project.source.transform.timeSegment.start, $store.state.project.source.transform.timeSegment.end]',
            :min='0',
            :max='$store.state.globals.source.duration',
            :step='0.01',
            range)
</template>
