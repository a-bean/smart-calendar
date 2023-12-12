<template>
  <div class="week">
    <WeekHeader />
    <div ref="bodyRef" class="flex-1 flex overflow-scroll pt-1.6">
      <TimeScale class="w15" />
      <WeekBody />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import WeekHeader from './components/week-header.vue';
import TimeScale from '../time-scale/time-scale.vue';
import WeekBody from './components/week-body.vue';
import { useDay } from '../../hooks/useDay';

const { taskBodyHeight } = useDay();

const bodyRef = ref<HTMLElement | null>(null);
const getBodyHeight = () => {
  taskBodyHeight.value = bodyRef.value?.clientHeight || 0;
};

onMounted(() => {
  getBodyHeight();
  window.addEventListener('resize', getBodyHeight);
});
onUnmounted(() => {
  window.removeEventListener('resize', getBodyHeight);
});
</script>
<style>
.week {
  --uno: w100% h100% flex flex-col select-none;
}
</style>
