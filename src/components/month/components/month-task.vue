<template>
  <div
    class="month-task"
    :class="{ 'bg-blue color-white': props.data?.id === selectedTaskId }"
    draggable="true"
    :data-id="props.data?.id"
    @click="selectedTask(props.data!.id as number)"
    @dragstart="onDragStart"
  >
    <div class="flex flex-items-center">
      <div class="month-task-point" :class="{ ' bg-white': props.data?.id === selectedTaskId }"></div>
      {{ props.data?.name }}
    </div>
    <div>{{ props.data?.id }}</div>
  </div>
</template>
<script setup lang="ts">
import { useMonth } from '@/hooks/useMonth';
import { TData } from '@/types';

const { onDragStart, selectedTaskId, selectedTask } = useMonth();

const props = defineProps<{
  data?: TData;
}>();
</script>

<style>
.month-task {
  @apply h4 font-size-2.8 border-rd pl-2 pr-2 flex flex-items-center justify-between box-border relative z1;
}
.month-task-point {
  @apply h1.4 w1.4 b-rd-50% mr1 bg-blue;
}
</style>
