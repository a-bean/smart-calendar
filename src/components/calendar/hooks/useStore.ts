import { ref, watch } from 'vue';
import { ECalendarType } from '../types';

type TStore = {
  calendarVisible: ECalendarType;
};

const store = ref<TStore>({
  calendarVisible: ECalendarType.WEEK,
});

watch(
  () => store.value.calendarVisible,
  (val) => {
    console.log(val, 'val');
  }
);

export const useStore = () => {
  const setStore = (value: Partial<TStore>) => {
    store.value = { ...store.value, ...value };
  };
  return {
    store,
    setStore,
  };
};
