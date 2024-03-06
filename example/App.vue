<template>
  <div class="h80vh w90vw">
    <Calendar v-slot="{ data }" :data="data" @get-date-scope="getDateScope" @change="onChange" @delete="onDelete">
      <div class="h200px w200px bg-red">{{ (data as TData).name }}</div>
    </Calendar>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import Calendar from '@/index.vue';
import { TData } from '@/types';

const data = ref<{ [key: string]: TData[] }>({});
const getDateScope = (scope: [string, string]) => {
  // TODO:根据scope请求数据
  console.log('所展示的时间:', scope);
  data.value = {
    '2024-03-06': [
      { id: 13, name: '库里', start: '2024-03-06 03:00', end: '2024-03-06 07:00', color: 'purple' },
      { id: 14, name: '格林', start: '2024-03-06 08:00', end: '2024-03-06 12:00' },
      { id: 15, name: '汤普森', start: '2024-03-06 05:00', end: '2024-03-06 13:00' },
    ],
  };
};

const onChange = (value: TData) => {
  console.log(value);
};

const onDelete = (id: number) => {
  console.log(id);
  // TODO:先请求删除接口，成功后再删除任务
  for (const key in data.value) {
    if (Object.prototype.hasOwnProperty.call(data.value, key)) {
      data.value[key] = data.value[key].filter((item) => item.id !== id);
    }
  }
};
</script>
