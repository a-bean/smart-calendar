<template>
  <div ref="boxRef" class="month-body-item" :data-date="props.data.date" @dragover="onDragover" @drop="onDrop">
    <div ref="titleRef" class="month-body-item-title" :class="{ 'color-#c9cdd4': !props.data.isCurrentMonth }">
      <div :class="{ 'border-b border-b-solid border-red ': props.data.isFirstDayOfLunarMonth }">
        {{ props.data.isFirstDayOfLunarMonth ? props.data.lunarMonth + props.data.lunarDay : props.data.lunarDay }}
      </div>
      <div v-if="props.data.isFirstDayOfMonth">
        {{ getDate({ date: props.data.date, format: 'MM月DD日' }) }}
      </div>
      <div v-else>
        <span v-if="props.data.isToday" class="month-body-item-is-today">
          {{ cutDay(props.data.date) }}
        </span>
        <span v-else>{{ cutDay(props.data.date) }} </span>
        日
      </div>
    </div>
    <div class="month-body-item-list">
      <MonthTask
        v-for="item of props.data.dataList?.slice(0, 1)"
        ref="taskRef"
        :key="item.id"
        :data="item"
        :class="`w${getMonthTaskWidth(item)}00%`"
      />
      <MonthTask
        v-for="item of props.data.dataList?.slice(1, showTaskCount - 1)"
        :key="item.id"
        :data="item"
        :class="`w${getMonthTaskWidth(item)}00%`"
      />
      <div v-if="surplusTaskCount > 0" class="month-body-item-list-surplus">还有{{ surplusTaskCount }}项...</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch, nextTick } from 'vue';
import { TData, TDate } from '@/types';
import MonthTask from './month-task.vue';
import { useMonth } from '@/hooks/useMonth';
import { getDate, getTimeInterval } from '@/date';

const { onDrop, onDragover } = useMonth();

const props = defineProps<{
  data: TDate & { dataList?: TData[] };
}>();

const getMonthTaskWidth = (data: TData) => {
  return getTimeInterval({ bigDate: data.end, smallDate: data.start, unit: 'day' }) + 1;
};

const cutDay = (day: string) => (day.slice(-2).startsWith('0') ? day.slice(-1) : day.slice(-2));

const boxRef = ref<HTMLElement | null>(null);
const titleRef = ref<HTMLElement | null>(null);

const taskRef = ref<InstanceType<typeof MonthTask>[]>([]);

const showTaskCount = ref(props.data.dataList?.length || 0);
const surplusTaskCount = computed(() => {
  if (props.data.dataList?.length) {
    return props.data.dataList.length - showTaskCount.value + 1;
  }
  return 0;
});

const getTaskBoxClientHeight = () => {
  const boxHeight = boxRef.value?.clientHeight;
  const titleHeight = titleRef.value?.clientHeight;
  if (!boxHeight || !titleHeight) return;
  // 不直接拿 month-body-item-list 的高度，因为没有设置溢出隐藏（为了实现跨日期的task）
  const taskBoxHeight = boxHeight - titleHeight;
  const taskHeight = taskRef.value[0]?.$el.clientHeight;
  if (!taskHeight || !taskBoxHeight || taskBoxHeight < 2 * taskHeight) return;

  showTaskCount.value = Math.floor(taskBoxHeight / taskHeight);
};

let timer: NodeJS.Timeout;
watch(
  () => props.data.dataList,
  () => {
    console.log('监测taskList变化');
    timer = setTimeout(() => {
      getTaskBoxClientHeight();
    });
  }
);

nextTick(() => {
  getTaskBoxClientHeight();
});

onMounted(() => {
  window.addEventListener('resize', getTaskBoxClientHeight);
});

onUnmounted(() => {
  window.removeEventListener('resize', getTaskBoxClientHeight);
  clearTimeout(timer);
});
</script>

<style>
.month-body-item {
  --uno: h100% flex flex-col position-relative;
}
.month-body-item-title {
  --uno: h6 flex flex-justify-between flex-items-center font-size-3.5 p2 pb0;
}
.month-body-item-is-today {
  --uno: inline-block h6 w6 border-rd-50% line-height-6 color-#fff bg-red text-center;
}
.month-body-item-list {
  --uno: flex-1 mt1;
}
.month-body-item-list-surplus {
  --uno: font-size-2.8 pl-2 pr-2;
}
</style>
