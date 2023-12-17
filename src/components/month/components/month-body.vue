<template>
  <div class="month-body">
    <div v-for="(row, index) of formatData" :key="index" class="month-body-box">
      <div
        v-for="(item, i) of row"
        :key="i"
        class="month-body-item-box"
        :style="{
          borderRight: i === 6 ? 'none' : '',
          background: item.isSaturdayOrSunday ? '#f3f3f3' : '',
        }"
      >
        <MonthBodyItem :data="item" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { TData, TDate } from '@/types';
import { convertTo2DArray, generateUUID } from '@/utils';
import MonthBodyItem from './month-body-item.vue';
import { getTimeInterval } from '@/date';

const props = defineProps<{
  data: (TDate & { dataList?: TData[] })[];
}>();

const formatData = computed(() => {
  const list = convertTo2DArray<TDate & { dataList?: TData[] }>(props.data, 7);
  for (let i = 0; i < list.length; i++) {
    for (let j = 0; j < list[i].length - 1; j++) {
      const dataList = list[i][j]?.dataList;
      if (dataList?.length) {
        dataList.forEach((item) => {
          const interval = getTimeInterval({ bigDate: item.end, smallDate: item.start, unit: 'day' });
          for (let k = 1; k <= interval; k++) {
            list[i][j + k].dataList?.unshift({
              id: generateUUID(),
              start: '',
              end: '',
              name: '',
            });
          }
        });
      }
    }
  }
  console.log('list', list);
  return list;
});
</script>

<style>
.month-body {
  @apply h100% flex flex-col;
}
.month-body-box {
  @apply flex flex-1 b-t-1 b-t-#ccc b-t-solid overflow-hidden;
}
.month-body-item-box {
  @apply flex-1 b-r-1 b-r-#ccc b-r-solid box-border h100% w100%;
}
</style>
@/calendar/types
