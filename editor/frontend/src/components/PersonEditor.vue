<script setup>

import {
  ref,
  watch,
  toRaw
} from "vue";

import {
  updatePerson
} from "../api";

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

async function save() {
  form.value.aliases =
      aliasesText.value
          .split("\n")
          .map(v => v.trim())
          .filter(Boolean);

  form.value.roles =
      rolesText.value
          .split("\n")
          .map(v => v.trim())
          .filter(Boolean);

  const updated =
      await updatePerson(
          form.value.slug,
          form.value
      );

  emit(
      "saved",
      updated
  );
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
          {{ form.slug }}
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
          ({{ aliasesText.split("\n").filter(Boolean).length }})
        </span>
      </h3>
      <textarea
          v-model="aliasesText"
          rows="8"
      />
      <small>
        One alias per line
      </small>
    </section>
    <section>
      <h3>
        Roles
        <span>
          ({{ rolesText.split("\n").filter(Boolean).length }})
        </span>
      </h3>
      <textarea
          v-model="rolesText"
          rows="8"
      />
      <small>
        One role per line
      </small>
    </section>
  </div>
</template>

<style scoped>

.editor {
  background:white;
  border:1px solid #ddd;
  border-radius:12px;
  padding:25px;
  min-height:700px;
}


.header {
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:30px;
  border-bottom:1px solid #eee;
  padding-bottom:15px;
}

h2 {
  margin:0;
}

small {
  color:#777;
}

section {
  margin-bottom:30px;
}

h3 {
  margin-bottom:10px;
}

input,
textarea {
  width:100%;
  box-sizing:border-box;
  font-size:15px;
  padding:12px;
  border:1px solid #ccc;
  border-radius:8px;
}

textarea {
  resize:vertical;
  min-height:160px;
  line-height:1.5;
}

button {
  padding:12px 25px;
  border-radius:8px;
  border:none;
  cursor:pointer;
  font-size:15px;
}

button:hover {
  opacity:.8;
}

</style>