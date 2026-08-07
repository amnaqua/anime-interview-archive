<script setup>

import { useToast } from "../composable/useToast";

const {
  toasts,
  remove
} = useToast();

</script>

<template>
  <div class="toast-container">
    <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast"
        :class="toast.type"
        @click="remove(toast.id)"
    >
      {{ toast.message }}
    </div>
  </div>
</template>

<style scoped>

.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 9999;
}

.toast {
  min-width: 280px;
  padding: 14px 18px;
  background: var(--bg-panel);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text);
  cursor: pointer;
  box-shadow: 0 5px 20px rgba(0,0,0,.3);
}

.toast.error {
  border-color: #b94a48;
}

.toast.success {
  border-color: #4caf50;
}

</style>