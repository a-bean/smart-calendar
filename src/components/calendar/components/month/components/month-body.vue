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
import { TDate } from '@/components/calendar/types';
import { convertTo2DArray } from '../../../utils';
import MonthBodyItem from './month-body-item.vue';

const props = defineProps<{
  data: (TDate & { dataList?: { id: number; name: string }[] })[];
}>();

const formatData = computed(() => convertTo2DArray<TDate>(props.data, 7));
</script>

<style>
.month-body {
  --uno: h100% flex flex-col;
}
.month-body-box {
  --uno: flex flex-1 b-t-1 b-t-#ccc b-t-solid overflow-hidden;
}
.month-body-item-box {
  --uno: flex-1 b-r-1 b-r-#ccc b-r-solid p2 h100% w100%;
}
</style>
