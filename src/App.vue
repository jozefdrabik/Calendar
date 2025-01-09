<script setup>
import { ref, computed } from "vue";
import Calendar from "./components/Calendar.vue";
import AdminDashboard from "./components/AdminDashboard.vue";

const routes = {
  "/": Calendar,
  "/admin-dashboard": AdminDashboard,
};

const currentPath = ref(window.location.hash);

window.addEventListener("hashchange", () => {
  currentPath.value = window.location.hash;
});

const currentView = computed(() => {
  return routes[currentPath.value.slice(1) || "/"] || Calendar;
});
</script>

<template>
  <nav
    class="flex flex-col md:flex-row items-center justify-center mt-4 mb-20 text-2xl font-bold gap-2"
  >
    <a href="#/">Calendar</a>
    <p class="hidden md:block">|</p>
    <a href="#/admin-dashboard">Admin Dashboard</a>
  </nav>
  <component :is="currentView" />
</template>
