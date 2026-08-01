<script setup>

import {
  ref,
  onMounted
} from "vue";

import {
  getReferenceData,
  generateContent
} from "../api";

import MultiSelect from "../components/MultiSelect.vue";

const reference = ref(null);

const form = ref({
  type: "interview",
  title: "",
  date: "",
  archived_at: "",
  language: "",
  media_type: "",
  people: [],
  work: [],
  companies: [],
  publisher: [],
  links: []
});

onMounted(async () => {
  reference.value =
      await getReferenceData();

});

async function generate() {
  const result =
      await generateContent(
          form.value
      );

  console.log(result);
}

</script>

<template>
  <div
      v-if="reference"
      class="page"
  >
    <div class="editor">
      <header>
        <h1>
          Content Generator
        </h1>
        <button
            @click="generate"
        >
          Generate
        </button>
      </header>
      <section>
        <label>
          Title
        </label>
        <input
            v-model="form.title"
        />
      </section>
      <section>
        <label>
          Type
        </label>
        <div class="select-wrapper">
          <select
              v-model="form.type"
          >
            <option value="interview">
              Interview
            </option>
            <option value="article">
              Article
            </option>
            <option value="artwork">
              Artwork
            </option>
            <option value="production_material">
              Production Material
            </option>
          </select>
        </div>
      </section>
      <section>
        <label>
          Date
        </label>
        <input
            type="date"
            v-model="form.date"
        />
      </section>
      <section>
        <label>
          Archived at
        </label>
        <input
            type="datetime-local"
            v-model="form.archived_at"
        />
      </section>
      <section>
        <label>
          Language
        </label>
        <div class="select-wrapper">
          <select
              v-model="form.language"
          >
            <option
                v-for="item in reference.languages"
                :key="item.slug"
                :value="item.slug"
            >
              {{ item.name }}
            </option>
          </select>
        </div>
      </section>
      <section>
        <label>
          Media Type
        </label>
        <div class="select-wrapper">
          <select
              v-model="form.media_type"
          >
            <option
                v-for="item in reference.mediaTypes"
                :key="item.slug"
                :value="item.slug"
            >
              {{ item.name }}
            </option>
          </select>
        </div>
      </section>
      <section>
        <label>
          People
        </label>
        <MultiSelect
            v-model="form.people"
            :items="reference.people"
        />
      </section>
      <section>
        <label>
          Works
        </label>
        <MultiSelect
            v-model="form.work"
            :items="reference.works"
        />
      </section>
      <section>
        <label>
          Companies
        </label>
        <MultiSelect
            v-model="form.companies"
            :items="reference.companies"
        />
      </section>
      <section>
        <label>
          Publishers
        </label>
        <MultiSelect
            v-model="form.publisher"
            :items="reference.publishers"
        />
      </section>
    </div>
  </div>
</template>

<style scoped>

.page {
  height: calc(100vh - 64px);
  overflow-y: auto;
  padding: 40px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  box-sizing: border-box;
}

.editor {
  width: 100%;
  max-width: 900px;
  background: var(--bg-panel);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 30px;
  box-sizing: border-box;
  margin-bottom: 40px;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 20px;
  margin-bottom: 30px;
  border-bottom: 1px solid var(--border);
}

header h1 {
  margin: 0;
  font-size: 26px;
}

section {
  margin-bottom: 25px;
}

label {
  display: block;
  margin-bottom: 8px;
  color: var(--text-muted);
}

input,
select {
  width: 100%;
  box-sizing: border-box;
  padding: 12px;
  background: var(--bg-input);
  color: var(--text);
  border: 1px solid var(--border);
  border-radius: 6px;
}

select[multiple] {
  min-height: 180px;
}

button {
  background: #303030;
  color: white;
  border: 1px solid var(--border);
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}

button:hover {
  background: #404040;
}

.select-wrapper {
  position: relative;
}

.select-wrapper::after {
  content: "";
  position: absolute;

  right: 16px;
  top: 50%;

  width: 7px;
  height: 7px;

  border-right: 2px solid var(--text-muted);
  border-bottom: 2px solid var(--text-muted);

  transform: translateY(-65%) rotate(45deg);

  pointer-events: none;
}

.select-wrapper select {
  appearance: none;
  -webkit-appearance: none;
  padding-right: 40px;
}

</style>