<script setup>

import {
  ref,
  computed
} from "vue";

const props = defineProps({
  items: {
    type: Array,
    required: true
  },

  modelValue: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits([
  "update:modelValue"
]);

const search = ref("");


const selectedItems =
    computed(() =>
        props.items.filter(
            item =>
                props.modelValue.includes(
                    item.slug
                )
        )
    );


const filteredItems =
    computed(() =>
        props.items.filter(
            item =>
                item.name
                    .toLowerCase()
                    .includes(
                        search.value.toLowerCase()
                    )
        )
    );


function toggle(slug) {

  const result =
      [...props.modelValue];


  const index =
      result.indexOf(slug);


  if (index === -1) {
    result.push(slug);
  }
  else {
    result.splice(index, 1);
  }


  emit(
      "update:modelValue",
      result
  );

}


function remove(slug) {

  emit(
      "update:modelValue",
      props.modelValue.filter(
          x => x !== slug
      )
  );

}

</script>


<template>

  <div class="multi">


    <div class="selected">

      <span
          v-for="item in selectedItems"
          :key="item.slug"
          class="tag"
      >
        {{ item.name }}

        <button
            @click="remove(item.slug)"
        >
          ×
        </button>

      </span>


      <span
          v-if="!selectedItems.length"
          class="empty"
      >
        Nothing selected
      </span>

    </div>


    <input
        v-model="search"
        placeholder="Search..."
    />


    <div class="options">

      <label
          v-for="item in filteredItems"
          :key="item.slug"
      >

        <input
            type="checkbox"
            :checked="modelValue.includes(item.slug)"
            @change="toggle(item.slug)"
        >

        {{ item.name }}

      </label>

    </div>


  </div>

</template>


<style scoped>

.multi {
  display: flex;
  flex-direction: column;
  gap: 8px;
}


/* выбранные элементы */
.selected {
  min-height: 42px;
  padding: 6px 8px;

  background: var(--bg-input);

  border: 1px solid var(--border);
  border-radius: 6px;

  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
}


.tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;

  background: #303030;

  padding: 4px 8px;

  border-radius: 12px;

  font-size: 13px;

  line-height: 18px;
}


.tag button {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 16px;
  height: 16px;

  padding: 0;

  border: none;
  background: transparent;

  color: #aaa;

  font-size: 16px;
  line-height: 1;

  cursor: pointer;
}


.tag button:hover {
  color: white;
}


.empty {
  color: var(--text-muted);
  font-size: 14px;
}


/* поиск */
.multi > input {
  height: 40px;

  width: 100%;

  box-sizing: border-box;

  padding: 0 12px;

  background: var(--bg-input);

  color: var(--text);

  border: 1px solid var(--border);

  border-radius: 6px;

  font-size: 14px;
}


.multi > input::placeholder {
  color: var(--text-muted);
}


/* список */
.options {
  max-height: 260px;

  overflow-y: auto;

  border: 1px solid var(--border);

  border-radius: 6px;

  padding: 6px;
}


/* элемент списка */
.options label {
  display: flex;

  align-items: center;

  gap: 8px;

  padding: 7px 8px;

  border-radius: 5px;

  cursor: pointer;

  font-size: 14px;

  line-height: 20px;
}


.options label:hover {
  background: #303030;
}


/* чекбокс */
.options input[type="checkbox"] {

  width: 16px;
  height: 16px;

  margin: 0;

  flex-shrink: 0;

}

</style>