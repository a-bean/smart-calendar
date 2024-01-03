import { ref, watch } from 'vue';
import { ECalendarType, TData, TDate } from '@/types';

type TStore = {
  data: { [key: string]: TData[] };
  calendarVisible: ECalendarType;
  currentDays: TDate[];
};

const store = ref<TStore>({
  calendarVisible: ECalendarType.DAY,
  data: {},
  currentDays: [],
});

watch(
  () => store.value.calendarVisible,
  (val) => {
    console.log(val, 'val');
  }
);

export const useStore = () => {
  /** 设置日历类型 */
  const setCalendarVisible = (value: ECalendarType) => {
    store.value.calendarVisible = value;
  };

  /** 获取网络请求的数据 */
  const getData = (value: { [key: string]: TData[] }) => {
    store.value.data = value;
  };

  return {
    store,
    getData,
    setCalendarVisible,
  };
};
