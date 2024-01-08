<template>
  <div class="flex flex-items-center justify-between">
    <HeaderTitle :date="timeTitle" />
    <RadioGroup v-model:model-value="store.calendarVisible">
      <Radio v-for="(value, key) of typeMap" :key="key" :value="key"> {{ value }} </Radio>
    </RadioGroup>
    <SwitchButton @recover="onRecover" @change="onChange" />
  </div>
</template>
<script setup lang="ts">
import HeaderTitle from '@/components/header-title/header-title.vue';
import RadioGroup from '@/components/radio/radio-group.vue';
import Radio from '@/components/radio/radio-item.vue';
import SwitchButton from '@/components/switch-button/switch-button.vue';
import { ECalendarType } from '@/types';
import { computed } from 'vue';
import { getDate, getDaysScope } from '@/date';
import { useStore } from '@/hooks/useStore';

const { store } = useStore();

const typeMap = {
  [ECalendarType.DAY]: '日',
  [ECalendarType.WEEK]: '周',
  [ECalendarType.MONTH]: '月',
  [ECalendarType.YEAR]: '年',
};
const timeTitle = computed(() => {
  const item = store.value.currentDate[0];
  if (!item?.date) return '';
  switch (store.value.calendarVisible) {
    case ECalendarType.DAY:
      return getDate({ date: item.date, format: 'YYYY年MM月DD日' });
    case ECalendarType.WEEK:
      return getDate({ date: item.date, format: 'YYYY年MM月' });
    case ECalendarType.MONTH:
      return getDate({ date: item.date, format: 'YYYY年MM月' });
    default:
      return getDate({ date: item.date, format: 'YYYY年' });
  }
});

let add = 0;
const onRecover = () => {
  add = 0;
  store.value.currentDate = getDaysScope({ type: store.value.calendarVisible, add });
};

const onChange = (value: number) => {
  console.log('change', value);
  add += value;
  store.value.currentDate = getDaysScope({ type: store.value.calendarVisible, add });
};
</script>
