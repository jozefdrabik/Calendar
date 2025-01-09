<script setup lang="ts">
import { computed, defineProps, defineEmits } from "vue";
import type { IDateObj, IMonthView } from "../types/calendarTypes.ts";

const props = defineProps<IMonthView>();
const emit = defineEmits([
  "dateSelect",
  "update:rangeStart",
  "update:rangeEnd",
]);

const dayNames = computed(() => {
  const locales: Record<string, string[]> = {
    en: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    cs: ["Po", "Út", "St", "Čt", "Pá", "So", "Ne"],
  };

  return locales[props.language.code || "en"];
});

const paddedDates = computed(() => {
  const dates: IDateObj[] = [];
  const firstDay = new Date(props.year, props.month, 1).getDay() || 7;
  const daysInMonth = new Date(props.year, props.month + 1, 0).getDate();

  const prevMonth = (props.month - 1 + 12) % 12;
  const prevYear = props.month === 0 ? props.year - 1 : props.year;
  const daysInPrevMonth = new Date(prevYear, prevMonth + 1, 0).getDate();

  for (let i = firstDay - 1; i > 0; i--) {
    dates.push({
      dateNumber: daysInPrevMonth - i + 1,
      fullDate: new Date(prevYear, prevMonth, daysInPrevMonth - i + 1),
      isOutOfMonth: true,
    });
  }

  for (let i = 1; i <= daysInMonth; i++) {
    dates.push({
      dateNumber: i,
      fullDate: new Date(props.year, props.month, i),
      isOutOfMonth: false,
    });
  }

  const remainingCells = (7 - (dates.length % 7)) % 7;
  const nextMonth = (props.month + 1) % 12;
  const nextYear = props.month === 11 ? props.year + 1 : props.year;

  for (let i = 1; i <= remainingCells; i++) {
    dates.push({
      dateNumber: i,
      fullDate: new Date(nextYear, nextMonth, i),
      isOutOfMonth: true,
    });
  }

  return dates;
});

const selectDate = (dateObj: IDateObj | null) => {
  if (dateObj && !dateObj.isOutOfMonth) {
    emit("dateSelect", dateObj.fullDate);
  }
};

const isSelected = (dateObj: IDateObj | null) => {
  return (
    dateObj &&
    !dateObj.isOutOfMonth &&
    props.selectedDates.some(
      (d) => d.toDateString() === dateObj.fullDate.toDateString()
    )
  );
};

const isStartDate = (dateObj: IDateObj | null) => {
  return (
    dateObj &&
    !dateObj.isOutOfMonth &&
    props.rangeStart?.toDateString() === dateObj.fullDate.toDateString()
  );
};

const isEndDate = (dateObj: IDateObj | null) => {
  return (
    dateObj &&
    !dateObj.isOutOfMonth &&
    props.rangeEnd?.toDateString() === dateObj.fullDate.toDateString()
  );
};

const isInRange = (dateObj: IDateObj | null) => {
  if (!props.rangeStart || !props.rangeEnd || !dateObj || dateObj.isOutOfMonth)
    return false;
  return (
    dateObj.fullDate > props.rangeStart && dateObj.fullDate < props.rangeEnd
  );
};
</script>

<template>
  <div class="month-view p-4 border rounded-lg shadow-md">
    <div class="grid grid-cols-7 gap-1 text-center font-semibold">
      <div v-for="day in dayNames" :key="day" class="p-1 text-gray-500">
        {{ day }}
      </div>
    </div>
    <div class="grid gap-1 text-center grid-cols-7">
      <div
        v-for="(date, index) in paddedDates"
        :key="index"
        @click="selectDate(date)"
        :class="{
          'cursor-pointer': date,
          'bg-blue-500 text-white': isSelected(date),
          'bg-blue-200': isInRange(date) && !date?.isOutOfMonth,
          'rounded-l-lg bg-blue-400': isStartDate(date),
          'rounded-r-lg bg-blue-400': isEndDate(date),
          'text-gray-400': date?.isOutOfMonth,
        }"
        class="p-2 border hover:bg-blue-100"
      >
        {{ date.dateNumber }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.month-view {
  max-width: 400px;
  background-color: #f9fafb;
}
</style>
