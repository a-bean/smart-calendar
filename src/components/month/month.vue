<template>
  <div class="month">
    <MonthHeader></MonthHeader>
    <MonthBody class="flex-1"></MonthBody>
  </div>
</template>
<script setup lang="ts">
import MonthHeader from './components/month-header.vue';
import MonthBody from './components/month-body.vue';
</script>

<style>
.month {
  @apply h100% flex flex-col b-1 b-#ccc border-rd b-solid min-h-120 min-w-230;
}
</style>
