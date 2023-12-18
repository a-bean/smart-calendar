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
import { convertTo2DArray } from '@/utils';
import MonthBodyItem from './month-body-item.vue';
import { getTimeInterval } from '@/date';

const props = defineProps<{
  data: (TDate & { dataList: TData[] })[];
}>();

const formatData = computed(() => {
  const list = convertTo2DArray<TDate & { dataList: TData[] }>(props.data, 7);
  for (let i = 0; i < list.length; i++) {
    for (let j = 0; j < list[i].length; j++) {
      const { dataList } = list[i][j];
      if (!dataList) continue;
      for (let k = 0; k < dataList.length; k++) {
        const { start, end } = dataList[k];
        const interval = getTimeInterval({ bigDate: end, smallDate: start, unit: 'day' });
        const offset = 7 - j;
        if (interval > offset && i < 5) {
          list[i + 1][0].dataList.push(dataList[k]);
        }
      }
    }
  }
  console.log('list11', list);
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
