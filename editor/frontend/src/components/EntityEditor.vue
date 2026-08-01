<script setup>

import {
  ref,
  watch,
  toRaw
} from "vue";

const props = defineProps({
  entity: {
    type: Object,
    required: true
  },

  config: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(["saved"]);
const form = ref(null);
const lists = ref({});

watch(
    () => props.entity,
    value => {
      if (!value) {
        return;
      }

      const raw =
          structuredClone(
              toRaw(value)
          );

      form.value =
          raw;

      props.config.fields
          .filter(
              f =>
                  f.type === "list"
          )
          .forEach(
              field => {

                lists.value[field.name] =
                    (
                        raw[field.name] ?? []
                    )
                        .join("\n");

              }
          );
    },
    {
      immediate: true
    }
);

function parseList(value) {
  return value
      .split(/[\n,]+/)
      .map(v => v.trim())
      .filter(Boolean);

}

function save() {
  props.config.fields
      .filter(
          f =>
              f.type === "list"
      )
      .forEach(
          field => {

            form.value[field.name] =
                parseList(
                    lists.value[field.name]
                );

          }
      );

  emit(
      "saved",
      form.value
  );
}
</script>

<template>
  <div
      v-if="form"
      class="editor"
  >
    <header>
      <h2>
        {{ form.name || "New" }}
      </h2>
      <button
          @click="save"
      >
        Save
      </button>
    </header>
    <section
        v-for="field in config.fields"
        :key="field.name"
    >
      <label>
        {{ field.label }}
      </label>
      <input
          v-if="field.type === 'text'"
          v-model="form[field.name]"
      />
      <textarea
          v-else-if="field.type === 'list'"
          v-model="lists[field.name]"
          rows="8"
      />
      <input
          v-else-if="field.type === 'number'"
          type="number"
          v-model.number="form[field.name]"
      />
    </section>
  </div>
</template>

<style scoped>

.editor {
  background: var(--bg-panel);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 25px;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border);
  margin-bottom: 25px;
  padding-bottom: 12px;
}

input,
textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 12px;
  background: var(--bg-input);
  color: var(--text);
  border: 1px solid var(--border);
  border-radius: 6px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: var(--text-muted);
}

section {
  margin-bottom: 25px;
}

button {
  background: #303030;
  color: var(--text);
  border: 1px solid var(--border);
  padding: 6px 16px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

button:hover {
  background: #404040;
}

h2 {
  margin: 0;
  font-size: 22px;
  font-weight: 600;
}

</style>