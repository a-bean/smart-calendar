<template>
  <div class="month">
    <MonthHeader></MonthHeader>
    <MonthBody class="flex-1" :data="completeData"></MonthBody>
  </div>
</template>
<script setup lang="ts">
import { onMounted } from 'vue';
import MonthHeader from './components/month-header.vue';
import MonthBody from './components/month-body.vue';
import { getOneDayOfWeekDaysAndMonthDays } from '../../date';
import { useMonth } from '../../hooks/useMonth';

const { currentDays, completeData } = useMonth();

onMounted(() => {
  currentDays.value = getOneDayOfWeekDaysAndMonthDays({ type: 'month' });
});
</script>

<style>
.month {
  --uno: h100% flex flex-col b-1 b-#ccc border-rd b-solid min-h-120 min-w-230;
}
</style>
