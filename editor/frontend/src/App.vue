<script setup>

import AppHeader from "./components/AppHeader.vue";

</script>

<template>
  <AppHeader />
  <main class="content">
    <router-view />
  </main>
</template>
<style>

.content {
  padding:30px;
}

</style>