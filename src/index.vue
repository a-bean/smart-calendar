<template>
  <div class="h80% w80%">
    <CalendarHeader />
    <DayCalendar v-if="store.calendarVisible === ECalendarType.DAY" />
    <WeekCalendar v-if="store.calendarVisible === ECalendarType.WEEK" />
    <MonthCalendar v-if="store.calendarVisible === ECalendarType.MONTH" />
    <Year v-if="store.calendarVisible === ECalendarType.YEAR" />
  </div>
</template>
<script setup lang="ts">
import { onMounted, onUpdated, watch } from 'vue';
// 组件
import MonthCalendar from './components/month/month.vue';
import DayCalendar from './components/day/day.vue';
import WeekCalendar from './components/week/week.vue';
import Year from './components/year/year.vue';
import CalendarHeader from './components/calendar-header/index.vue';
// hooks, utils
import { useStore } from './hooks/useStore';
import { useMonth } from '@/hooks/useMonth';
// types
import { ECalendarType, TData } from './types';
import { getDaysScope } from '@/date';

const { replenishCurrentDays } = useMonth();
const { store, getData, firstDay } = useStore();

const props = defineProps<{ data: { [key: string]: TData[] } }>();

onUpdated(() => {
  getData(props.data);
});

// emitter
const emitter = defineEmits<{
  (event: 'getDateScope', scope: [string, string]): void;
}>();

watch(
  () => store.value.currentDate,
  () => {
    if (store.value.calendarVisible === ECalendarType.MONTH) {
      emitter('getDateScope', [replenishCurrentDays.value[0].date, replenishCurrentDays.value[replenishCurrentDays.value.length - 1].date]);
    } else if (store.value.calendarVisible === ECalendarType.DAY) {
      emitter('getDateScope', [store.value.currentDate[0].date, store.value.currentDate[0].date]);
    } else if (store.value.calendarVisible === ECalendarType.WEEK) {
      emitter('getDateScope', [store.value.currentDate[0].date, store.value.currentDate[store.value.currentDate.length - 1].date]);
    }
  }
);

watch(
  () => store.value.calendarVisible,
  () => {
    store.value.currentDate = getDaysScope({ type: store.value.calendarVisible, date: firstDay.value });
  },
  {
    immediate: true,
  }
);
</script>
