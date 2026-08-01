<script setup>

import {
  ref,
  onMounted
} from "vue";

import {
  getPeople,
  getPerson
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

function savedPerson(person) {
  selected.value =
      person;

  const index =
      people.value.findIndex(
          item =>
              item.slug === person.slug
      );

  if (index !== -1) {
    people.value[index] = {
      ...people.value[index],
      name: person.name
    };
  }
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
          @saved="savedPerson"
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

</style>