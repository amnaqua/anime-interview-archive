<script setup>

import EntityPage from "./EntityPage.vue";
import publishers from "../configs/publishers";

</script>

<template>
  <EntityPage
      :config="publishers"
  />
</template>