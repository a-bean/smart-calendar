<template>
  <div class="year-month">
    <div class="year-month-title">{{ props.data[0].month }}</div>
    <div class="year-month-body">
      <div class="year-month-header">
        <div v-for="item of weeks" :key="item" class="year-month-header-item">
          {{ item.slice(1, 2) }}
        </div>
      </div>
      <div class="year-month-content">
        <div v-for="(row, rowIndex) of replenishCurrentDays" :key="rowIndex" class="year-month-content-row">
          <div
            v-for="item of row"
            :key="item.date"
            class="flex-1 text-center"
            :class="{
              'color-#ccc': !item.isCurrentMonth,
              'b-b-solid b-b-1 b-red': item.isFirstDayOfLunarMonth,
              'bg-red color-white b-rd-50%': item.isToday,
            }"
          >
            {{ item.day.startsWith('0') ? item.day.slice(-1) : item.day }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineProps, computed } from 'vue';
import { getDate, getLunarDay, weeks } from '@/date';
import { convertTo2DArray } from '@/utils';
import { TYearDate } from '@/types';
import { cloneDeep } from 'lodash';

const props = defineProps<{
  data: TYearDate[];
}>();

const replenishCurrentDays = computed((): TYearDate[][] => {
  if (!props.data.length) return [];
  const newDays = cloneDeep(props.data);

  // 补全前面的日期
  while (newDays[0].weekIndex !== 0) {
    const date = getDate({ date: newDays[0].date, add: -1 });
    newDays.unshift({
      date,
      day: date.slice(-2),
      month: newDays[0].month,
      weekIndex: newDays[0].weekIndex - 1,
      isCurrentMonth: false,
      isToday: false,
      isFirstDayOfLunarMonth: getLunarDay(date) === '初一',
    });
  }
  // 补全后面的日期
  while (newDays.length < 42) {
    const date = getDate({ date: newDays[newDays.length - 1].date, add: 1 });
    newDays.push({
      date,
      day: date.slice(-2),
      month: newDays[0].month,
      weekIndex: newDays[newDays.length - 1].weekIndex + 1,
      isCurrentMonth: false,
      isToday: false,
      isFirstDayOfLunarMonth: getLunarDay(date) === '初一',
    });
  }

  return convertTo2DArray<TYearDate>(newDays, 7);
});
</script>
<style>
.year-month {
  --uno: h100% w100% p2 flex flex-col;
}

.year-month-title {
  --uno: color-red h6;
}

.year-month-body {
  --uno: flex-1 font-size-3.5 flex flex-col;
}

.year-month-header {
  --uno: w100% flex justify-between mb-4 mt-4;
}
.year-month-header-item {
  --uno: font-size-3.6;
}

.year-month-content {
  --uno: flex-1 flex flex-col justify-between;
}

.year-month-content-row {
  --uno: flex justify-between flex-content-between;
}
</style>
