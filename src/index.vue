<template>
  <div class="h80% w80%">
    <div class="flex flex-items-center justify-between">
      <HeaderTitle date="2023年2月3日" />
      <RadioGroup v-model:model-value="store.calendarVisible">
        <Radio v-for="(value, key) of typeMap" :key="key" :value="key">
          {{ value }}
        </Radio>
      </RadioGroup>
      <SwitchButton />
    </div>
    <MonthCalendar />
    <!--    <DayCalendar />-->
    <!--    <WeekCalendar />-->
    <!--    <Year />-->
  </div>
</template>
<script setup lang="ts">
import { onUpdated, watch } from 'vue';
// 组件
import MonthCalendar from './components/month/month.vue';
import DayCalendar from './components/day/day.vue';
import WeekCalendar from './components/week/week.vue';
import Year from './components/year/year.vue';
import RadioGroup from './components/radio/radio-group.vue';
import Radio from './components/radio/radio-item.vue';
import SwitchButton from './components/switch-button/switch-button.vue';
import HeaderTitle from './components/header-title/header-title.vue';

// hooks, utils
import { useStore } from './hooks/useStore';
import { useMonth } from '@/hooks/useMonth';

// types
import { ECalendarType, TData } from './types';

const { replenishCurrentDays } = useMonth();
const { store, getData } = useStore();

const typeMap = {
  [ECalendarType.DAY]: '日',
  [ECalendarType.WEEK]: '周',
  [ECalendarType.MONTH]: '月',
  [ECalendarType.YEAR]: '年',
};

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
    console.log('store.value.currentDays', store.value.currentDate);
    if (store.value.calendarVisible === ECalendarType.MONTH) {
      console.log(1);
      emitter('getDateScope', [replenishCurrentDays.value[0].date, replenishCurrentDays.value[replenishCurrentDays.value.length - 1].date]);
    } else if (store.value.calendarVisible === ECalendarType.DAY) {
      emitter('getDateScope', [store.value.currentDate[0].date, store.value.currentDate[0].date]);
      console.log(2);
    } else {
      console.log(3);
      emitter('getDateScope', [store.value.currentDate[0].date, store.value.currentDate[store.value.currentDate.length - 1].date]);
    }
  }
);
</script>
