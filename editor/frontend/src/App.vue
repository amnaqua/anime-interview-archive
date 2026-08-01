<template>

  <div class="container">

    <h1>
      Anime Interview Archive Editor
    </h1>


    <button @click="loadPeople">
      Load people
    </button>


    <div class="layout">


      <div>

        <h2>
          People
        </h2>


        <EntityList
            v-if="people.length"
            :items="people"
            @select="selectPerson"
        />

      </div>


      <div
          v-if="selected"
      >

        <h2>
          {{ selected.name }}
        </h2>


        <PersonEditor
            :person="selected"
            @saved="selected = $event"
        />

      </div>


    </div>


  </div>

</template>


<script setup>

import {
  ref
} from "vue";

import {
  getPerson
} from "./api";

import axios from "axios";

import EntityList from "./components/EntityList.vue";
import PersonEditor from "./components/PersonEditor.vue";

const people = ref([]);

const selected = ref(null);


async function loadPeople() {

  const response =
      await axios.get(
          "http://localhost:3001/api/people"
      );


  people.value =
      response.data;

}


async function selectPerson(person){
  const fullPerson =
      await getPerson(
          person.slug
      );

  console.log(
      "Loaded person:",
      fullPerson
  );

  selected.value =
      fullPerson;
}


</script>


<style>

body {

  font-family: sans-serif;

  padding: 40px;

}


.container {

  max-width: 1000px;

  margin: auto;

}


.layout {

  display: grid;

  grid-template-columns:300px 1fr;

  gap: 40px;

  margin-top: 30px;

}

</style>