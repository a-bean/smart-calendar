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
    <template v-if="!props.data.hidden">
      <div class="mt-0.6 ml-2">
        {{ getDate({ date: props.data.start, format: 'MM-DD HH:mm' }) }} - {{ getDate({ date: props.data.end, format: 'MM-DD HH:mm' }) }}
      </div>
      <div class="ml-2">{{ props.data.name }}</div>
    </template>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { getDate, isBefore } from '@/date';
import { ONE_HOUR_HEIGHT, ETaskMoveType } from '@/config';
import { useWeek } from '@/hooks/useWeek';
import { TData } from '@/types';

const props = defineProps<{
  data: TData;
  dateKey: string;
}>();

const { selectedTask, mousedown, mouseenter } = useWeek();

const top = computed(() => {
  const isSmallThanToday = isBefore(props.data.start, props.dateKey);
  if (isSmallThanToday) {
    return 0;
  }

  const hour = getDate({ date: props.data.start, format: 'HH' });
  const minutes = getDate({ date: props.data.start, format: 'mm' });
  return Number(hour) * ONE_HOUR_HEIGHT + Number(minutes) * (ONE_HOUR_HEIGHT / 60);
});

const height = computed(() => {
  let startTimeHour = getDate({ date: props.data.start, format: 'HH' });
  let startTimeMinutes = getDate({ date: props.data.start, format: 'mm' });

  const startIsSmallThanToday = isBefore(props.data.start, props.dateKey);

  if (startIsSmallThanToday) {
    startTimeHour = '0';
    startTimeMinutes = '0';
  }

  let endTimeHour = '0';
  let endTimeMinutes = '0';
  const endIsBiggerThanToday = isBefore(props.dateKey, getDate({ date: props.data.end, format: 'YYYY-MM-DD' }));

  if (endIsBiggerThanToday) {
    endTimeHour = '24';
  } else {
    endTimeHour = getDate({ date: props.data.end, format: 'HH' });
    endTimeMinutes = getDate({ date: props.data.end, format: 'mm' });
  }

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
