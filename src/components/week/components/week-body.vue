<template>
  <div v-for="(data1, index) of store.data" :key="index" class="flex-1 position-relative" @mouseenter="mouseenter">
    <div class="position-absolute top--1.6 left-0 right-0 h1.6" :class="{ 'b-r-solid b-r-1 b-r-#ccc': index !== 7 }"></div>
    <TimeDivider :need-right-border="index !== 7" />
    <template v-for="(items, index) of groupSchedulesByOverlap(data1)" :key="index">
      <template v-for="(item, i) of items" :key="item.id">
        <DayTask :data="item" :style="{ width: `${100 / items.length}%`, left: `${i * (100 / items.length)}%` }" />
      </template>
    </template>
  </div>
</template>
<script setup lang="ts">
import { useStore } from '@/hooks/useStore';
import TimeDivider from '@/components/time-divider/time-divider.vue';
import DayTask from '@/components/day/components/day-task.vue';
import { groupSchedulesByOverlap } from '@/utils';

const { store } = useStore();

const mouseenter = (e: Event) => {
  // console.log(e);
};
</script>
<style>
.week-body-items {
  @apply flex-1 flex h100%;
}
</style>
