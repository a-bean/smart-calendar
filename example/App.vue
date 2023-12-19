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
  // console.log('scope', scope);
  // mock data
  data.value = {
    '2023-11-26': [{ id: 7, name: '吴九', start: '2023-11-06', end: '2023-12-19' }],
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
