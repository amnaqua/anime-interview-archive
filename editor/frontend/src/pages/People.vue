<script setup>

import { ref, onMounted } from "vue";

import {
  getPeople,
  getPerson,
  createPerson,
  updatePerson
} from "../api";

import EntityList from "../components/EntityList.vue";
import PersonEditor from "../components/PersonEditor.vue";

const people = ref([]);
const selected = ref(null);

onMounted(async () => {
  people.value =
      await getPeople();
});

async function selectPerson(person) {
  selected.value =
      await getPerson(
          person.slug
      );
}

async function savePerson(person) {
  let saved;

  if (person.isNew) {
    saved =
        await createPerson({
          name: person.name,
          aliases: person.aliases,
          roles: person.roles
        });
  } else {
    saved = await updatePerson(
        person.slug,
        person
    );
  }

  selected.value = saved;

  const index =
      people.value.findIndex(
          item => item.slug === saved.slug
      );

  if (index === -1) {
    people.value.push({
      slug: saved.slug,
      name: saved.name
    });
  } else {
    people.value[index].name = saved.name;
  }
}

function newPerson() {
  selected.value = {
    slug: null,
    name: "",
    aliases: [],
    roles: [],
    isNew: true
  };
}

</script>

<template>
  <div class="page">
    <aside class="sidebar">
      <div class="sidebar-header">
        <h1>
          People
        </h1>
        <button
            class="new-button"
            @click="newPerson"
        >
          + New
        </button>
      </div>
      <EntityList
          :items="people"
          :selected="selected"
          @select="selectPerson"
      />
    </aside>
    <main
        v-if="selected"
        class="editor"
    >
      <PersonEditor
          :person="selected"
          @saved="savePerson"
      />
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
  height: calc(100vh - 64px);
  overflow: hidden;
}

.sidebar {
  overflow: hidden;
  border-right: 1px solid var(--border);
  padding-right: 20px;
  height: 100%;
}

.editor {
  padding: 25px;
  overflow-y: auto;
}

.empty {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  font-size: 18px;
}

.sidebar-header {
  display:flex;
  justify-content:space-between;
  align-items:center;
  margin-bottom:15px;
}

.sidebar-header h1 {
  margin:0;
}

.new-button {
  background:#303030;
  color:var(--text);
  border:1px solid var(--border);
  padding:8px 14px;
  border-radius:6px;
  cursor:pointer;
}

.new-button:hover {
  background:#404040;
}

</style>