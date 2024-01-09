import { ref, watch } from 'vue';
import { ECalendarType, TData, TDate } from '@/types';
import { getDaysScope } from '@/date';

type TStore = {
  data: { [key: string]: TData[] };
  calendarVisible: ECalendarType;
  currentDate: TDate[];
  addStep: number;
};

const store = ref<TStore>({
  calendarVisible: ECalendarType.DAY,
  data: {},
  currentDate: [],
  addStep: 0,
});

export const useStore = () => {
  /** 获取网络请求的数据 */
  const getData = (value: { [key: string]: TData[] }) => {
    store.value.data = value;
  };

  const onRecover = () => {
    store.value.addStep = 0;
    store.value.currentDate = getDaysScope({
      type: store.value.calendarVisible,
      date: new Date(),
    });
  };

  const onChange = (value: number) => {
    store.value.currentDate = getDaysScope({
      type: store.value.calendarVisible,
      date: store.value.currentDate[0].date,
      add: value,
    });
  };

  watch(
    () => store.value.calendarVisible,
    () => {
      store.value.addStep = 0;
    }
  );

  return {
    store,
    getData,
    onRecover,
    onChange,
  };
};
