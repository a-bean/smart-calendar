<template>
  <div ref="bodyRef" class="flex-1 position-relative">
    <TimeDivider />
    <CurrentTimeline class="w100% position-absolute" />
    <template v-for="(item, index) of props.data" :key="item.id">
      <DayTask :data="item" :class="`w${100 / 2}% left-${index * 50}%`" />
    </template>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import TimeDivider from '@/components/time-divider/time-divider.vue';
import CurrentTimeline from '@/components/current-timeline/current-timeline.vue';
import DayTask from './day-task.vue';
import { useDay } from '@/hooks/useDay';
import { TData } from '@/types';

const props = defineProps<{
  data: TData[];
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
