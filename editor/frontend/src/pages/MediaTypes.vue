<script setup>

import EntityPage from "./EntityPage.vue";
import mediaTypes from "../configs/media-types";

</script>
<template>
  <EntityPage
      :config="mediaTypes"
  />
</template>