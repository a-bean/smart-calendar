<template>
  <div class="radio-group-item" :class="{ active: active === attrs.value }">
    <slot> </slot>
  </div>
</template>
<script setup lang="ts">
import { useAttrs, inject } from 'vue';

const active = inject('switcher');
const attrs = useAttrs();
</script>
<style>
.active {
  background-color: #f2f2f2;
}
</style>

<style>
.radio-group-item {
  @apply h3 w16 border-rd-0.8 p-b1 p-t1 text-center line-height-3 active:bg-#e6e6e6 hover:bg-gray;
}
</style>
