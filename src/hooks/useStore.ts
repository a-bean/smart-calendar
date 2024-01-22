import { ref } from 'vue';
import { ECalendarType, TData, TDate } from '@/types';
import { getDaysScope } from '@/date';

type TStore = {
  data: { [key: string]: TData[] };
  calendarVisible: ECalendarType;
  currentDate: TDate[];
};

const store = ref<TStore>({
  calendarVisible: ECalendarType.WEEK,
  data: {},
  currentDate: [],
});

const currentDay = ref<string | Date>(new Date());

export const useStore = () => {
  /** 获取网络请求的数据 */
  const getData = (value: { [key: string]: TData[] }) => {
    store.value.data = value;
  };

  const onRecover = () => {
    store.value.currentDate = getDaysScope({
      type: store.value.calendarVisible,
      date: new Date(),
    });
    currentDay.value = store.value.currentDate[0].date;
  };

  const onChange = (value: number) => {
    store.value.currentDate = getDaysScope({
      type: store.value.calendarVisible,
      date: store.value.currentDate[0].date,
      add: value,
    });
    currentDay.value = store.value.currentDate[0].date;
  };

  return {
    store,
    currentDay,
    getData,
    onRecover,
    onChange,
  };
};
