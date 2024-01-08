import { ref } from 'vue';
import { ECalendarType, TData, TDate } from '@/types';

type TStore = {
  data: { [key: string]: TData[] };
  calendarVisible: ECalendarType;
  currentDate: TDate[];
  title: string;
};

const store = ref<TStore>({
  calendarVisible: ECalendarType.DAY,
  data: {},
  currentDate: [],
  title: '',
});

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
