<script setup>

import AppHeader from "./components/AppHeader.vue";
import ToastContainer from "./components/ToastContainer.vue";

</script>

<template>
  <AppHeader />
  <ToastContainer />
  <main class="content">
    <router-view />
  </main>
</template>
<style>

.content {
  padding:30px;
}

</style>