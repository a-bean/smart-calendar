<template>
  <div class="h80% w80%">
    <!-- <HeaderTitle date="2023年2月3日" />
    <RadioGroup v-model:model-value="store.calendarVisible">
      <Radio v-for="(value, key) of typeMap" :key="key" :value="key">
        {{ value }}
      </Radio>
    </RadioGroup>
    <SwitchButton /> -->
    <MonthCalendar />
    <!--    <DayCalendar />-->
    <!--    <WeekCalendar />-->
    <!--    <Year /> &ndash;&gt;-->
  </div>
</template>
<script setup lang="ts">
import MonthCalendar from './components/month/month.vue';
import DayCalendar from './components/day/day.vue';
import WeekCalendar from './components/week/week.vue';
import RadioGroup from './components/radio/radio-group.vue';
import Radio from './components/radio/radio-item.vue';
import SwitchButton from './components/switch-button/switch-button.vue';
import HeaderTitle from './components/header-title/header-title.vue';
import Year from './components/year/year.vue';
import { useStore } from './hooks/useStore';
import { ECalendarType, TData } from './types';
import { useMonth } from '@/hooks/useMonth';
import { onUpdated, watch } from 'vue';
import { typeOf } from '@/utils';

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
  () => store.value.currentDays,
  () => {
    if (store.value.calendarVisible === ECalendarType.MONTH) {
      emitter('getDateScope', [replenishCurrentDays.value[0].date, replenishCurrentDays.value[replenishCurrentDays.value.length - 1].date]);
    } else {
      emitter('getDateScope', [store.value.currentDays[0].date, store.value.currentDays[store.value.currentDays.length - 1].date]);
    }
  }
);
</script>
