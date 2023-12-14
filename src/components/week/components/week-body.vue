<template>
  <div v-for="item of 7" :key="item" class="flex-1 position-relative" @mouseenter="mouseenter">
    <div class="position-absolute top--1.6 left-0 right-0 h1.6" :class="{ 'b-r-solid b-r-1 b-r-#ccc': item !== 7 }"></div>
    <TimeDivider :need-right-border="item !== 7" />
    <DayTask v-for="data of mokeData" :key="data.id" :data="data" class="w98%" />
  </div>
</template>
<script setup lang="ts">
import { useDay } from '@/hooks/useDay';
import TimeDivider from '@/components/time-divider/time-divider.vue';
import DayTask from '@/components/day/components/day-task.vue';

const { mokeData } = useDay();

const mouseenter = (e: Event) => {
  console.log(e);
};
</script>
<style>
.week-body-items {
  --uno: flex-1 flex h100%;
}
</style>
