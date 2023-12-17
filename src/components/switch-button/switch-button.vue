<template>
  <div class="switch-container">
    <div class="switch-btn" @click="emitter(EEvents.prev)">
      <div class="i-material-symbols:chevron-left"></div>
    </div>
    <div class="switch-btn switch-btn-today" @click="emitter(EEvents.now)">今天</div>
    <div class="switch-btn">
      <div class="i-material-symbols:chevron-right" @click="emitter(EEvents.next)"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
enum EEvents {
  next = 'onNext',
  prev = 'onPrev',
  now = 'onNow',
}

const emitter = defineEmits<{
  (event: EEvents.next): void;
  (event: EEvents.prev): void;
  (event: EEvents.now): void;
}>();
</script>

<style>
.switch-container {
  @apply h5 flex cursor-pointer flex-items-center select-none;
}

.switch-btn {
  @apply h5 w5 flex justify-center flex-items-center
         b b-color-#ccc border-rd-1.2 b-solid hover:bg-gray active:bg-#e6e6e6;
}

.switch-btn-today {
  @apply ml-1px mr-1px w12 text-center font-size-3 line-height-5;
}
</style>
