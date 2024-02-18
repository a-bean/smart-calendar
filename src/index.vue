<template>
  <div class="h100% w100%">
    <CalendarHeader />
    <component :is="showComponent"></component>
  </div>
</template>
<script setup lang="ts">
import { onUpdated, watch, computed } from 'vue';
// 组件
import MonthCalendar from './components/month/month.vue';
import DayCalendar from './components/day/day.vue';
import WeekCalendar from './components/week/week.vue';
import YearCalendar from './components/year/year.vue';
import CalendarHeader from './components/calendar-header/index.vue';
// hooks, utils
import { useStore } from './hooks/useStore';
import { useMonth } from '@/hooks/useMonth';
// types
import { ECalendarType, TData } from './types';
import { getDaysScope } from '@/date';

const props = defineProps<{ data: { [key: string]: TData[] } }>();
const emitter = defineEmits<{
  (event: 'getDateScope', scope: [string, string]): void;
  (event: 'change', data: TData): void;
}>();

const { store, getData, currentDay, onTaskChange } = useStore();
const { replenishCurrentDays } = useMonth();

onTaskChange.value = (data: TData) => {
  emitter('change', data);
};

onUpdated(() => {
  getData(props.data);
});

const components = {
  [ECalendarType.DAY]: DayCalendar,
  [ECalendarType.WEEK]: WeekCalendar,
  [ECalendarType.MONTH]: MonthCalendar,
  [ECalendarType.YEAR]: YearCalendar,
};
const showComponent = computed(() => components[store.value.calendarVisible]);

/*
  [key in Exclude<ECalendarType, ECalendarType.YEAR>]
  本来应该除去ECalendarType.YEAR，year不需要请求数据，但是
  这样在使用的emitterFn使用的时候还需要进行类型判断，所以直接
  写成ECalendarType，代码更加简洁
 */
const emitterFn: { [key in ECalendarType]: () => void } = {
  [ECalendarType.MONTH]: () => {
    emitter('getDateScope', [replenishCurrentDays.value[0].date, replenishCurrentDays.value[replenishCurrentDays.value.length - 1].date]);
  },
  [ECalendarType.DAY]: () => {
    emitter('getDateScope', [store.value.currentDate[0].date, store.value.currentDate[0].date]);
  },
  [ECalendarType.WEEK]: () => {
    emitter('getDateScope', [store.value.currentDate[0].date, store.value.currentDate[store.value.currentDate.length - 1].date]);
  },
  [ECalendarType.YEAR]: () => {},
};

watch(
  () => store.value.currentDate,
  () => {
    emitterFn[store.value.calendarVisible]();
  }
);

watch(
  () => store.value.calendarVisible,
  () => {
    store.value.currentDate = getDaysScope({ type: store.value.calendarVisible, date: currentDay.value });
  },
  {
    immediate: true,
  }
);
</script>
