<script setup>

import {
  ref,
  onMounted
} from "vue";

import {
  getPeople,
  getPerson,
  updatePerson
} from "../api";

import EntityList from "../components/EntityList.vue";

const people = ref([]);
const selected = ref(null);
const saving = ref(false);

onMounted(async () => {
  people.value =
      await getPeople();
});

async function selectPerson(person) {
  selected.value =
      await getPerson(person.slug);
}

async function save() {
  saving.value = true;

  selected.value =
      await updatePerson(
          selected.value.slug,
          selected.value
      );

  saving.value = false;
}

</script>

<template>
  <div class="page">
    <aside class="sidebar">
      <h1>
        People
      </h1>
      <EntityList
          :items="people"
          @select="selectPerson"
      />
    </aside>
    <main
        v-if="selected"
        class="editor"
    >
      <div class="header">
        <h1>
          {{ selected.name }}
        </h1>
        <button
            @click="save"
            :disabled="saving"
        >
          {{ saving ? "Saving..." : "Save" }}
        </button>
      </div>
      <section>
        <label>
          Name
        </label>
        <input
            v-model="selected.name"
        />
      </section>
      <section>
        <label>
          Aliases
        </label>
        <textarea
            v-model="selected.aliases"
            rows="6"
        />
      </section>
      <section>
        <label>
          Roles
        </label>
        <textarea
            v-model="selected.roles"
            rows="8"
        />
      </section>
    </main>
    <main
        v-else
        class="empty"
    >
      Select person
    </main>
  </div>

</template>

<style scoped>

.page {
  display: grid;
  grid-template-columns:320px 1fr;
  height: calc(100vh - 80px);
  gap: 30px;
}

.sidebar {
  overflow: auto;
  border-right: 1px solid #ddd;
  padding-right: 20px;
}

.editor {
  max-width: 900px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

section {
  margin-bottom: 25px;
}


label {
  display: block;
  font-weight: bold;
  margin-bottom: 8px;
}

input,
textarea {
  width: 100%;
  box-sizing: border-box;
  padding: 12px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 6px;
}

textarea {
  resize: vertical;
  min-height: 120px;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}

.empty {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
}

.layout {
  display: grid;
  grid-template-columns:320px minmax(900px, 1fr);
  gap: 40px;
  align-items: start;
}

</style>