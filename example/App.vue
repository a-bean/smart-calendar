<template>
  <div class="h80vh w90vw">
    <Calendar :data="data" @get-date-scope="getDateScope"></Calendar>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import Calendar from '@/index.vue';
import { TData } from '@/types';

const data = ref<{ [key: string]: TData[] }>({});
const getDateScope = (scope: [string, string]) => {
  console.log('所展示的时间:', scope);
  data.value = {
    '2024-01-30': [
      { id: 13, name: '库里', start: '2024-01-30 03:00', end: '2024-01-30 07:00' },
      { id: 14, name: '库里', start: '2024-01-30 03:00', end: '2024-01-31 07:00' },
    ],
  };
};
</script>
