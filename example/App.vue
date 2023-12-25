<template>
  <div class="h100vh w100vw">
    <Calendar :data="data" @get-date-scope="getDateScope"></Calendar>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import Calendar from '@/index.vue';
import { TData } from '@/types';

const data = ref<{ [key: string]: TData[] }>({});
const getDateScope = (scope: [string, string]) => {
  console.log('scope', scope);
  // mock data
  data.value = {
    '2023-12-05': [
      { id: 3, name: '吴九', start: '2023-12-05', end: '2023-12-05' },
      { id: 2, name: '吴九', start: '2023-12-05', end: '2023-12-05' },
    ],
    '2023-12-06': [
      { id: 7, name: '吴九', start: '2023-12-06', end: '2023-12-16' },
      { id: 8, name: '郑十', start: '2023-12-06', end: '2023-12-06' },
      { id: 9, name: '郑十', start: '2023-12-06', end: '2023-12-06' },
    ],
    '2023-12-10': [
      { id: 10, name: '郑十', start: '2023-12-10', end: '2023-12-10' },
      { id: 11, name: '郑十', start: '2023-12-10', end: '2023-12-10' },
    ],
    // '2023-12-03': [{ id: 7, name: '吴九', start: '2023-12-03 08:00:00', end: '2024-01-04 09:00:00' }],
    // '2023-12-04': [{ id: 8, name: '郑十', start: '2023-12-04 09:00:00', end: '2023-12-06 10:00:00' }],
    // '2023-12-05': [
    //   { id: 27, name: '吴九', start: '2023-12-05 08:00:00', end: '2023-12-05 09:00:00' },
    //   { id: 28, name: '吴九', start: '2023-12-05 08:00:00', end: '2023-12-05 09:00:00' },
    //   { id: 18, name: '郑十', start: '2023-12-05 09:00:00', end: '2023-12-05 10:00:00' },
    // ],
    // '2024-01-06': [{ id: 17, name: '吴九', start: '2024-01-06 08:00:00', end: '2024-01-06 09:00:00' }],
  };
};
</script>
