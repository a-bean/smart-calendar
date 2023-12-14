<template>
  <div
    v-for="item of 24"
    :key="item"
    class="time-divider"
    :class="{ 'b-b-solid b-b': item === 24, 'b-r-solid b-r b-r-#ccc': props.needRightBorder }"
    :style="{ height: `${ONE_HOUR_HEIGHT}%` }"
  ></div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';
import { ONE_HOUR_HEIGHT } from '@/config';

const props = defineProps<{
  needRightBorder?: boolean;
}>();
</script>

<style>
.time-divider {
  --uno: w100% b-t-solid b-t b-#ccc box-border b-#ccc;
}
</style>
