<template>
  <div class="day">
    <!-- header -->
    <div class="day-header">
      <div class="day-header-left">全天</div>
      <div class="day-header-right">大雪</div>
    </div>
    <!-- body -->
    <div class="day-body">
      <!-- 刻度 -->
      <TimeScale class="w15" />
      <!-- 任务区域 -->
      <dayBody :data="data" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { useDay } from '@/hooks/useDay';
import TimeScale from '@/components/time-scale/time-scale.vue';
import dayBody from './components/day-body.vue';
import { TData } from '@/types';
import { computed } from 'vue';

const { mockData } = useDay();

const doSchedulesOverlap = (schedule1: TData, schedule2: TData) => {
  const start1 = new Date(schedule1.start).getTime();
  const end1 = new Date(schedule1.end).getTime();
  const start2 = new Date(schedule2.start).getTime();
  const end2 = new Date(schedule2.end).getTime();
  return start1 < end2 && end1 > start2;
};

const groupSchedulesByOverlap = (schedules: TData[]) => {
  const result: TData[][] = [];

  for (let i = 0; i < schedules.length; i++) {
    const resultIds = result.flat().map((item) => item.id);
    if (resultIds.includes(schedules[i].id)) {
      continue;
    }
    const arr: TData[] = [schedules[i]];
    for (let j = i + 1; j < schedules.length; j++) {
      const overlappingSchedule = doSchedulesOverlap(schedules[i], schedules[j]);
      if (!resultIds.includes(schedules[j].id) && overlappingSchedule) {
        arr.push(schedules[j]);
      }
    }
    result.push(arr);
  }
  return result;
};

const data = computed(() => {
  return groupSchedulesByOverlap(mockData.value);
});
</script>

<style>
.day {
  @apply h100% flex flex-col select-none;
}
.day-header {
  @apply h6 b-t-solid b-t-1 b-b-solid b-b-3 b-#ccc flex flex-items-center font-size-3;
}
.day-header-left {
  @apply w15 text-right line-height-6 color-#aaa pr-1;
}
.day-header-right {
  @apply flex-1 bg-green b-rd h5 line-height-5 pl-1.5 color-#fff fw-600;
}
.day-body {
  @apply flex-1 overflow-scroll flex pt-1.6 pb-1.6;
}
</style>
