<template>
  <div ref="bodyRef" class="flex-1 position-relative">
    <TimeDivider />
    <CurrentTimeline class="w100% position-absolute" />
    <DayTask v-for="item of props.data" :key="item.id" class="w100%" :data="item" />
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import TimeDivider from '../../time-divider/time-divider.vue';
import CurrentTimeline from '../../current-timeline/current-timeline.vue';
import DayTask from './day-task.vue';
import { useDay } from '../../../hooks/useDay';

const props = defineProps<{
  data: {
    id: number;
    title: string;
    startTime: string;
    endTime: string;
    color: string;
  }[];
}>();

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
<style lang="scss" scoped></style>
