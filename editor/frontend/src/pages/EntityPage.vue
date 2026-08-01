<script setup>

import {
  ref,
  onMounted
} from "vue";

import {
  getEntities,
  getEntity,
  createEntity,
  updateEntity
} from "../api";

import EntityList from "../components/EntityList.vue";
import EntityEditor from "../components/EntityEditor.vue";

const props =
    defineProps({
      config: {
        type: Object,
        required: true
      }
    });

const items = ref([]);
const selected = ref(null);

onMounted(
    async () => {
      items.value =
          await getEntities(
              props.config.endpoint
          );
    }
);

async function select(item) {
  selected.value =
      await getEntity(
          props.config.endpoint,
          item.slug
      );
}

function create() {
  selected.value = {
    slug: null,
    isNew: true,
    ...props.config.newItem
  };
}

async function save(entity) {
  let result;

  if (entity.isNew) {
    result =
        await createEntity(
            props.config.endpoint,
            entity
        );
  } else {
    result =
        await updateEntity(
            props.config.endpoint,
            entity.slug,
            entity
        );
  }

  selected.value =
      result;

  const index =
      items.value.findIndex(
          i =>
              i.slug === result.slug
      );
  if (index === -1) {
    items.value.push(result);
  } else {
    items.value[index] =
        result;

  }
}

</script>

<template>
  <div class="page">
    <aside>
      <h1>
        {{ config.title }}
      </h1>
      <button
          @click="create"
      >
        + New
      </button>
      <EntityList
          :items="items"
          :selected="selected"
          @select="select"
      />
    </aside>
    <main>
      <EntityEditor
          v-if="selected"
          :entity="selected"
          :config="config"
          @saved="save"
      />
    </main>
  </div>
</template>

<style scoped>

.page {
  display: grid;
  grid-template-columns: 320px 1fr;
  height: calc(100vh - 64px);
  overflow: hidden;
}

aside {
  border-right: 1px solid var(--border);
  padding-right: 20px;
  height: 100%;
  overflow: hidden;
}

aside h1 {
  margin: 0 0 15px;
}

main {
  padding: 25px;
  overflow-y: auto;
}

button {
  background: #303030;
  color: var(--text);
  border: 1px solid var(--border);
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 15px;
}

button:hover {
  background: #404040;
}

</style>