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
    <!-- <DayCalendar />
    <WeekCalendar />
    <Year /> -->
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
import { ECalendarType } from './types';

const { store } = useStore();

const typeMap = {
  [ECalendarType.DAY]: '日',
  [ECalendarType.WEEK]: '周',
  [ECalendarType.MONTH]: '月',
  [ECalendarType.YEAR]: '年',
};
</script>
