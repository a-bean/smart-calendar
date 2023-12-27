<template>
  <div
    class="day-task"
    :style="{ top: `${top}%`, height: `${height}%` }"
    @click="selectedTask(props.data.id as number)"
    @mousedown="(e) => mousedown(e, props.data.id as number, ETaskMoveType.MOVE_WHOLE)"
  >
    <!--上拖拉的线-->
    <div
      class="day-drag-line top--1.5"
      @mousedown.stop="(e) => mousedown(e, props.data.id as number, ETaskMoveType.MOVE_TOP)"
      @mouseenter="mouseenter(ETaskMoveType.MOVE_TOP)"
    ></div>
    <!--下拖拉的线-->
    <div
      class="day-drag-line bottom--1.5"
      @mousedown.stop="(e) => mousedown(e, props.data.id as number, ETaskMoveType.MOVE_BOTTOM)"
      @mouseenter="mouseenter(ETaskMoveType.MOVE_BOTTOM)"
    ></div>

    <div class="mt-0.6 ml-2">
      {{ getDate({ date: props.data.start, format: 'HH:mm' }) }} - {{ getDate({ date: props.data.end, format: 'HH:mm' }) }}
    </div>
    <div class="ml-2">{{ props.data.name }}</div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { getDate } from '@/date';
import { ONE_HOUR_HEIGHT, ETaskMoveType } from '@/config';
import { useDay } from '@/hooks/useDay';
import { TData } from '@/types';

const { selectedTask, mousedown, mouseenter } = useDay();

const props = defineProps<{
  data: TData;
}>();

const top = computed(() => {
  const hour = getDate({ date: props.data.start, format: 'HH' });
  const minutes = getDate({ date: props.data.start, format: 'mm' });
  return Number(hour) * ONE_HOUR_HEIGHT + Number(minutes) * (ONE_HOUR_HEIGHT / 60);
});

const height = computed(() => {
  const startTimeHour = getDate({ date: props.data.start, format: 'HH' });
  const startTimeMinutes = getDate({ date: props.data.start, format: 'mm' });

  const endTimeHour = getDate({ date: props.data.end, format: 'HH' });
  const endTimeMinutes = getDate({ date: props.data.end, format: 'mm' });

  return (
    Number(endTimeHour) * ONE_HOUR_HEIGHT +
    Number(endTimeMinutes) * (ONE_HOUR_HEIGHT / 60) -
    (Number(startTimeHour) * ONE_HOUR_HEIGHT + Number(startTimeMinutes) * (ONE_HOUR_HEIGHT / 60))
  );
});
</script>
<style>
.day-task {
  @apply w100% bg-blue bg-opacity-60 b-rd-2 font-size-3 color-white b-l-solid b-l-4 b-blue box-border position-absolute;
}

.day-drag-line {
  @apply h3 w100% position-absolute cursor-row-resize;
}
</style>
