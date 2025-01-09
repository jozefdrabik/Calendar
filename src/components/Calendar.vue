<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import MonthView from "./MonthView.vue";
import type { IDateRange } from "../types/calendarTypes.ts";
import { useCalendarSettings } from "../composables/useCalendarSettings";

const { settings, fetchSettings } = useCalendarSettings();

const currentDate = new Date();
const currentMonth = ref(currentDate.getMonth());
const currentYear = ref(currentDate.getFullYear());
const selectedDates = ref<Date[]>([]);
const rangeStart = ref<Date | undefined>();
const rangeEnd = ref<Date | undefined>();
const errorMessage = ref<string>("");

const predefinedRanges = ref<IDateRange[]>([
  { label: "Last Minute", startDate: new Date(), endDate: new Date() },
  {
    label: "Winter 2024",
    startDate: new Date("2024-11-01"),
    endDate: new Date("2024-12-31"),
  },
]);

onMounted(async () => {
  await fetchSettings();

  if (!settings.favoriteDates) {
    settings.favoriteDates = "";
  }

  if (settings.defaultRange) {
    const [start, end] = settings.defaultRange.split(",");
    rangeStart.value = new Date(start.trim());
    rangeEnd.value = new Date(end.trim());
  }

  if (settings.favoriteDates) {
    const favoriteDatesArray = settings.favoriteDates.split(";");

    favoriteDatesArray.forEach((entry, index) => {
      const trimmedEntry = entry.trim();
      const range = trimmedEntry.split(",");

      if (range.length === 2) {
        const startDate = new Date(range[0].trim());
        const endDate = new Date(range[1].trim());

        if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
          predefinedRanges.value.push({
            label: `Favorite Range ${index + 1}`,
            startDate,
            endDate,
          });
        }
      } else if (range.length === 1) {
        const date = new Date(range[0].trim());

        if (!isNaN(date.getTime())) {
          predefinedRanges.value.push({
            label: `Favorite Date ${index + 1}`,
            startDate: date,
            endDate: date,
          });
        }
      }
    });
  }
});

const formattedCurrentMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value).toLocaleString(
    settings.language.code || "en",
    {
      month: "long",
      year: "numeric",
    }
  );
});

const formattedNextMonth = computed(() => {
  const nextMonthValue = (currentMonth.value + 1) % 12;
  const nextYearValue =
    currentMonth.value + 1 > 11 ? currentYear.value + 1 : currentYear.value;

  return new Date(nextYearValue, nextMonthValue).toLocaleString(
    settings.language.code || "en",
    {
      month: "long",
      year: "numeric",
    }
  );
});

const nextMonth = computed(() => (currentMonth.value + 1) % 12);
const nextYear = computed(() =>
  currentMonth.value + 1 > 11 ? currentYear.value + 1 : currentYear.value
);

const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value -= 1;
  } else {
    currentMonth.value -= 1;
  }
};

const nextMonthFunc = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value += 1;
  } else {
    currentMonth.value += 1;
  }
};

const onDateSelect = (date: Date) => {
  errorMessage.value = "";

  if (!rangeStart.value || (rangeStart.value && rangeEnd.value)) {
    rangeStart.value = date;
    rangeEnd.value = undefined;
    return;
  }

  let start = rangeStart.value;
  let end = date;

  if (date < rangeStart.value) {
    start = date;
    end = rangeStart.value;
  }

  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (settings.maxNights && diffDays > settings.maxNights) {
    errorMessage.value = `You cannot select a range longer than ${settings.maxNights} nights.`;
    return;
  }

  rangeStart.value = start;
  rangeEnd.value = end;
};

const selectRange = (range: IDateRange) => {
  const diffTime = Math.abs(
    range.endDate.getTime() - range.startDate.getTime()
  );
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (!settings.maxNights || diffDays <= settings.maxNights) {
    rangeStart.value = range.startDate;
    rangeEnd.value = range.endDate;
    errorMessage.value = "";
  } else {
    errorMessage.value = `This predefined range exceeds the maximum of ${settings.maxNights} nights.`;
  }
};

const selectedRangeDisplay = computed(() => {
  if (rangeStart.value && rangeEnd.value) {
    return `${rangeStart.value.toLocaleDateString()} - ${rangeEnd.value.toLocaleDateString()}`;
  }
  return "No range selected";
});
</script>

<template>
  <div
    class="calendar-container p-4 border rounded-lg shadow-md max-w-2xl mx-auto"
  >
    <div class="flex justify-between items-center mb-4">
      <button @click="prevMonth" class="btn">◀️</button>
      <h2 class="text-xl font-bold">
        {{ formattedCurrentMonth }} - {{ formattedNextMonth }}
      </h2>
      <button @click="nextMonthFunc" class="btn">▶️</button>
    </div>

    <div class="grid sm:grid-cols-2 justify-center gap-4">
      <MonthView
        :month="currentMonth"
        :year="currentYear"
        :selectedDates="selectedDates"
        :rangeStart="rangeStart"
        :rangeEnd="rangeEnd"
        :minDate="settings.minDate"
        :maxNights="settings.maxNights"
        :language="settings.language"
        :defaultRange="settings.defaultRange"
        @dateSelect="onDateSelect"
      />
      <MonthView
        :month="nextMonth"
        :year="nextYear"
        :selectedDates="selectedDates"
        :rangeStart="rangeStart"
        :rangeEnd="rangeEnd"
        :minDate="settings.minDate"
        :maxNights="settings.maxNights"
        :language="settings.language"
        :defaultRange="settings.defaultRange"
        @dateSelect="onDateSelect"
      />
    </div>
    <div class="mt-4">
      <h4 class="font-bold mb-2">Predefined Ranges</h4>
      <ul>
        <li
          v-for="range in predefinedRanges"
          :key="range.label"
          @click="selectRange(range)"
          class="cursor-pointer hover:underline p-1"
        >
          {{ range.label }}
        </li>
      </ul>
    </div>
    <div class="mt-4">
      <h4 class="font-bold">Selected Range</h4>
      <p>{{ selectedRangeDisplay }}</p>
      <p v-if="errorMessage" class="text-red-500">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<style scoped>
.calendar-container {
  max-width: 800px;
}
.btn {
  padding: 0.5rem;
  background-color: #ddd;
  border-radius: 4px;
  cursor: pointer;
}
.btn:hover {
  background-color: #ccc;
}
</style>
