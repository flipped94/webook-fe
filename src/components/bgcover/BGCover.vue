<script setup>
var props = defineProps({
  showCover: Boolean
})
</script>
<template>
  <div class="bg-cover" v-if="props.showCover" @click="$emit('handleHideLogin')"></div>
</template>

<style scoped>
.bg-cover {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 998;
}
</style>
