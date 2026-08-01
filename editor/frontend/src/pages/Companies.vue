<script setup>

import EntityPage from "./EntityPage.vue";
import companies from "../configs/companies";

</script>

<template>
  <EntityPage
      :config="companies"
  />
</template>