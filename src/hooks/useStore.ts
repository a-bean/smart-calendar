import { ref } from 'vue';
import { ECalendarType, TData, TDate } from '@/types';
import { getDaysScope } from '@/date';

type TStore = {
  data: { [key: string]: TData[] };
  calendarVisible: ECalendarType;
  currentDate: TDate[];
  selectedTaskId: number;
};

const store = ref<TStore>({
  calendarVisible: ECalendarType.DAY,
  data: {},
  currentDate: [],
  selectedTaskId: 0,
});

const onTaskChange = ref<(data: TData) => void>();

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

  const selectedTask = (id: number) => {
    store.value.selectedTaskId = id;
  };

  const deleteTask = () => {
    if (!store.value.selectedTaskId) return;

    // 删除任务。通过store.value.selectedTaskId删除store.value.data中的数据
    for (const key in store.value.data) {
      if (Object.prototype.hasOwnProperty.call(store.value.data, key)) {
        store.value.data[key] = store.value.data[key].filter((item) => item.id !== store.value.selectedTaskId);
      }
    }
  };

  let isPressedMeta = false;
  const clickMeta = () => {
    isPressedMeta = true;
  };

  const clickBackspace = () => {
    if (isPressedMeta) {
      deleteTask();
    }
  };

  const onKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Meta') {
      clickMeta();
    }
    if (e.key === 'Backspace') {
      clickBackspace();
    }
  };

  const onKeyup = (e: KeyboardEvent) => {
    if (e.key === 'Meta') {
      isPressedMeta = false;
    }
  };

  return {
    store,
    currentDay,
    getData,
    onRecover,
    onChange,
    onTaskChange,
    selectedTask,
    deleteTask,
    onKeydown,
    onKeyup,
  };
};
