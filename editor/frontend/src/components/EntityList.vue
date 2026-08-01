<script setup>

const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  selected: {
    type: Object,
    default: null
  }
});

const emit = defineEmits([
  "select"
]);

function select(item) {
  emit(
      "select",
      item
  );
}

</script>

<template>
  <div class="list">
    <div
        v-for="item in items"
        :key="item.slug"
        class="entity-item"
        :class="{
        active:selected?.slug === item.slug
      }"
        @click="select(item)"
    >
      {{ item.name }}
    </div>
  </div>
</template>

<style scoped>

.list {
  height: calc(100vh - 140px);
  overflow-y: auto;
}

.entity-item {
  padding: 12px 15px;
  border-bottom: 1px solid var(--border);
  cursor: pointer;
  color: var(--text);
}

.entity-item:hover {
  background: var(--hover);
}

.entity-item.active {
  background: var(--active);
}

.list::-webkit-scrollbar {
  width: 8px;
}

.list::-webkit-scrollbar-track {
  background: #181818;
}

.list::-webkit-scrollbar-thumb {
  background: #4a4a4a;
  border-radius: 5px;
}

.list::-webkit-scrollbar-thumb:hover {
  background: #666;
}

</style>