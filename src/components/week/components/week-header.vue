<template>
  <div>
    <div class="w100% flex font-size-3.5">
      <div class="w15 h6 line-height-6 text-right color-#ccc">10月</div>
      <div v-for="item of weeks" :key="item" class="h6 line-height-6 flex-1 flex justify-between pr2 pl2">
        <div>初一 25</div>
        <div>{{ item }}</div>
      </div>
    </div>
    <div class="w100% flex font-size-2.5 b-t-solid b-b-solid b-#ccc b-t-1 b-b-3">
      <div class="w15 h4 line-height-4 text-right color-#ccc pl2 pr2 box-border">全天</div>
      <div v-for="(item, index) of weeks" :key="item" class="flex-1 flex">
        <div class="h4 flex-1 box-border" :class="{ 'b-r-solid b-r-1 b-r-#ccc': index !== 6 }"></div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { weeks } from '@/date';
</script>

<style>
.month-header-item {
  @apply;
}
</style>
