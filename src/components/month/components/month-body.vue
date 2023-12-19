<template>
  <div class="month-body">
    <div v-for="(row, rowIndex) of formatData" :key="rowIndex" class="month-body-box">
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
import MonthBodyItem from './month-body-item.vue';
import { useMonth } from '@/hooks/useMonth';

const { formatData } = useMonth();
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
