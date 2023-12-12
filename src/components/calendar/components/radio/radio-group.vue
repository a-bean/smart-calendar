<template>
  <div class="radio-group">
    <div class="radio-group-item-box" @click="onClick">
      <slot></slot>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, provide, watch } from 'vue';

const props = defineProps(['modelValue']);
const emit = defineEmits(['update:modelValue']);

const active = ref('');
provide('switcher', active);
watch(
  () => props.modelValue,
  () => {
    active.value = props.modelValue;
  },
  {
    immediate: true,
  }
);

const onClick = (e: Event) => {
  emit('update:modelValue', (e.target as HTMLElement).getAttribute('value'));
  active.value = (e.target as HTMLElement).getAttribute('value') as string;
};
</script>
<style>
.radio-group {
  --uno: inline-block cursor-pointer select-none;
}
.radio-group-item-box {
  --uno: flex justify-center flex-items-center b-1 b-#ccc border-rd b-solid;
}
</style>
