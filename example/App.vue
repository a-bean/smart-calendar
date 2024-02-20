<template>
  <div class="h80vh w90vw">
    <Calendar :data="data" @get-date-scope="getDateScope" @change="onChange"></Calendar>
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
    '2024-02-20': [
      { id: 13, name: '库里', start: '2024-02-20 03:00', end: '2024-02-20 07:00', color: 'purple' },
      { id: 14, name: '格林', start: '2024-02-20 08:00', end: '2024-02-20 12:00' },
      { id: 15, name: '汤普森', start: '2024-02-20 05:00', end: '2024-02-21 13:00' },
    ],
  };
};

const onChange = (value: TData) => {
  console.log(value);
};
</script>
