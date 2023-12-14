<template>
  <div class="year">
    <div v-for="(month, index) of yearDates" :key="index">
      <YearMonth :data="month" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import YearMonth from './components/year-month.vue';
import { getYearDates } from '../../date';

const yearDates = ref(getYearDates());
</script>
<style>
.year {
  --uno: h100% w100% grid grid-cols-4 grid-rows-3 gap-4%;
}
</style>
