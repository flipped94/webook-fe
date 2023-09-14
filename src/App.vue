<script setup>
import { RouterView } from 'vue-router'
import TheHeader from './components/header/TheHeader.vue'
</script>

<template>
  <header>
    <TheHeader></TheHeader>
  </header>
  <main>
    <!-- <div style="height: 100000px;"></div> -->
    <RouterView />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
}
</style>
