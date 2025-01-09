<script setup lang="ts">
import { useCalendarSettings } from "../composables/useCalendarSettings";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/vue";
import { languages } from "../utils";

const { settings, saveSettings } = useCalendarSettings();
</script>

<template>
  <div class="p-6 border rounded-lg shadow-md max-w-[800px] mx-auto">
    <h2 class="text-2xl font-bold mb-6">Admin Dashboard - Calendar Settings</h2>
    <form @submit.prevent="saveSettings">
      <div class="mb-4">
        <label for="maxNights" class="block font-medium mb-1"
          >Maximum Nights</label
        >
        <input
          v-model="settings.maxNights"
          type="number"
          id="maxNights"
          class="input"
          placeholder="Enter maximum nights"
        />
      </div>

      <div class="mb-4">
        <label for="minDate" class="block font-medium mb-1">Minimum Date</label>
        <input
          v-model="settings.minDate"
          type="date"
          id="minDate"
          class="input"
        />
      </div>
      <div class="mb-4">
        <label for="language" class="block font-medium mb-1">Language</label>
        <Listbox v-model="settings.language">
          <div class="relative">
            <ListboxButton class="input cursor-pointer text-left">
              {{ settings.language.name || "Select Language" }}
            </ListboxButton>
            <ListboxOptions
              class="absolute mt-1 max-h-60 overflow-auto border rounded-md bg-white shadow-md w-40"
            >
              <ListboxOption
                v-for="language in languages"
                :key="language.id"
                :value="language"
                class="p-2 hover:bg-gray-100 cursor-pointer border-b"
              >
                {{ language.name }}
              </ListboxOption>
            </ListboxOptions>
          </div>
        </Listbox>
      </div>

      <div class="mb-4">
        <label for="defaultRange" class="block font-medium mb-1"
          >Default Date Range</label
        >
        <input
          v-model="settings.defaultRange"
          type="text"
          id="defaultRange"
          class="input"
          placeholder="e.g., 2024-01-01,2024-01-07"
        />
      </div>

      <div class="mb-6">
        <label for="favoriteDates" class="block font-medium mb-1"
          >Favorite Dates</label
        >
        <input
          v-model="settings.favoriteDates"
          type="text"
          id="favoriteDates"
          class="input"
          placeholder="e.g., 2024-01-01,2024-01-07;2024-02-01,2024-02-07"
        />
      </div>

      <button type="submit" class="btn-save">Save Settings</button>
    </form>
  </div>
</template>

<style scoped>
.input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.875rem;
}

.input:focus {
  outline: none;
  border-color: #4caf50;
}

.btn-save {
  background-color: #4caf50;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-save:hover {
  background-color: #45a049;
}
</style>
