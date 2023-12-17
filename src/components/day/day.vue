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
      <dayBody :data="mokeData" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { useDay } from '@/hooks/useDay';
import TimeScale from '@/components/time-scale/time-scale.vue';
import dayBody from './components/day-body.vue';

const { mokeData } = useDay();
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
