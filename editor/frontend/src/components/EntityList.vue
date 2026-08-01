<script setup>

defineProps({
  items: {
    type: Array,
    required: true
  }
});

const emit = defineEmits([
  "select"
]);

function select(item) {

  console.log("EntityList click", item);

  emit(
      "select",
      item
  );

}

</script>

<template>
  <div>
    <div
        v-for="item in items"
        :key="item.slug"
        class="entity-item"
        @mousedown="select(item)"
    >
      {{ item.name }}
    </div>
  </div>
</template>

<style scoped>

.entity-item {
  padding: 10px;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
}

.entity-item:hover {
  background: #f5f5f5;
}

.entity-item {
  padding:10px;
  border-bottom:1px solid #ddd;
  cursor:pointer;

  pointer-events:auto;
  user-select:none;
}

</style>