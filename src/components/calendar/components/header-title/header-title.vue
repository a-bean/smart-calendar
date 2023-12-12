<template>
  <div class="font-size-8">{{ props.date }}</div>
</template>
<script setup lang="ts">
const props = defineProps<{
  date: string;
}>();
</script>
