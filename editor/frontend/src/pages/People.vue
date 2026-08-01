<script setup>

import EntityPage from "./EntityPage.vue";
import people from "../configs/people";

</script>

<template>
  <EntityPage
      :config="people"
  />
</template>