<script setup>

import {
  ref,
  watch,
  toRaw
} from "vue";

const props = defineProps({
  person: {
    type: Object,
    default: null
  }
});

const emit = defineEmits([
  "saved"
]);

const form = ref(null);
const aliasesText = ref("");
const rolesText = ref("");

watch(
    () => props.person,
    value => {

      if (!value) {
        return;
      }

      const raw = toRaw(value);

      form.value = structuredClone(raw);

      aliasesText.value =
          (raw.aliases ?? []).join("\n");

      rolesText.value =
          (raw.roles ?? []).join("\n");

    },
    {
      immediate: true
    }
);

function save() {
  form.value.aliases =
      parseList(
          aliasesText.value
      );

  form.value.roles =
      parseList(
          rolesText.value
      );

  emit("saved", form.value);
}

function parseList(value) {
  const result = [];
  let current = "";
  let depth = 0;

  for (const char of value) {
    if (char === "(" || char === "（") {
      depth++;
      current += char;
      continue;
    }

    if (char === ")" || char === "）") {
      depth = Math.max(0, depth - 1);
      current += char;
      continue;
    }

    if ((char === "," || char === "\n") && depth === 0) {
      const trimmed = current.trim();

      if (trimmed) {
        result.push(trimmed);
      }

      current = "";
      continue;
    }

    current += char;
  }

  const trimmed = current.trim();

  if (trimmed) {
    result.push(trimmed);
  }

  return result;
}

</script>

<template>
  <div
      v-if="form"
      class="editor"
  >
    <div class="header">
      <div>
        <h2>
          {{ form.name }}
        </h2>
        <small>
          {{ form.slug ?? 'New person' }}
        </small>
      </div>
      <button
          @click="save"
      >
        Save
      </button>
    </div>
    <section>
      <h3>
        Basic information
      </h3>
      <label>
        Name
      </label>
      <input
          v-model="form.name"
      />
    </section>
    <section>
      <h3>
        Aliases
        <span>
          ({{ parseList(aliasesText).length }})
        </span>
      </h3>
      <textarea
          v-model="aliasesText"
          rows="8"
      />
      <small>
        Separate values with commas or new lines. Commas inside parentheses are kept.
      </small>
    </section>
    <section>
      <h3>
        Roles
        <span>
          ({{ parseList(rolesText).length }})
        </span>
      </h3>
      <textarea
          v-model="rolesText"
          rows="8"
      />
      <small>
        Separate values with commas or new lines. Commas inside parentheses are kept.
      </small>
    </section>
  </div>
</template>

<style scoped>

.editor {
  background: var(--bg-panel);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 25px;
  min-height: 700px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  border-bottom: 1px solid #eee;
  padding-bottom: 15px;
}

h2 {
  margin: 0;
}

small {
  color: #777;
}

section {
  margin-bottom: 30px;
}

h3 {
  margin-bottom: 10px;
}

input,
textarea {
  width: 100%;
  box-sizing: border-box;
  font-size: 15px;
  padding: 12px;
  background: var(--bg-input);
  color: var(--text);
  border: 1px solid var(--border);
  border-radius: 6px;
}

textarea {
  resize: vertical;
  min-height: 160px;
  line-height: 1.5;
}

button {
  background: #383838;
  color: var(--text);
  border: 1px solid var(--border);
  padding: 12px 25px;
  border-radius: 6px;
  cursor: pointer;
}

button:hover {
  background: #4a4a4a;
}

</style>