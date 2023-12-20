import { computed, reactive, ref } from 'vue';
import { cloneDeep } from 'lodash';
import { weeks, getWeekIndex, getDate, getLunarDay, getLunarMonth, getTimeInterval, isBefore } from '@/date';
import { convertTo2DArray, findDropTargetDate, findTaskById } from '@/utils';
import { TData, TDate } from '@/types';
import { useStore } from '@/hooks/useStore';

const { store } = useStore();
const taskBoxWidth = ref<number>(); // 记录任务盒子的宽度

const dragData = reactive<{
  /** 选中的task的id */
  targetId: number;
  /** 鼠标移动停止所有在日期 */
  targetDate: string | null;
  /** 选中的task */
  targetTask: TData | null;
  /** 选中的task片段的开始时间 */
  targetFragmentStart: string;
  /** 选中的task片段的结束时间 */
  targetEnd: string;
  offset: number;
}>({
  targetId: 0,
  targetDate: '',
  targetTask: null,
  offset: 0,
  targetFragmentStart: '',
  targetEnd: '',
});

const selectedTaskId = ref(0);

export const useMonth = () => {
  /** 填满日历 */
  const replenishCurrentDays = computed((): TDate[] => {
    if (!store.value.currentDays.length) return [];
    const newDays = cloneDeep(store.value.currentDays);

    // 补全前面的日期
    while (newDays[0].weekIndex !== 0) {
      const date = getDate({ date: newDays[0].date, add: -1 });
      newDays.unshift({
        date,
        weekIndex: newDays[0].weekIndex - 1,
        week: weeks[getWeekIndex(newDays[0].date, -1)],
        isCurrentMonth: false,
        isFirstDayOfMonth: false,
        isToday: false,
        isFirstDayOfLunarMonth: getLunarDay(date) === '初一',
        isSaturdayOrSunday: newDays[0].weekIndex - 1 === 0 || newDays[0].weekIndex - 1 === 6,
        lunarDay: getLunarDay(date),
        lunarMonth: getLunarMonth(date),
      });
    }
    // 补全后面的日期
    while (newDays[newDays.length - 1].weekIndex !== 6) {
      const date = getDate({ date: newDays[newDays.length - 1].date, add: 1 });
      newDays.push({
        date,
        weekIndex: newDays[newDays.length - 1].weekIndex + 1,
        week: weeks[getWeekIndex(newDays[newDays.length - 1].date, 1)],
        isCurrentMonth: false,
        isToday: false,
        isFirstDayOfMonth: false,
        isFirstDayOfLunarMonth: getLunarDay(date) === '初一',
        isSaturdayOrSunday: newDays[newDays.length - 1].weekIndex + 1 === 0 || newDays[newDays.length - 1].weekIndex + 1 === 6,
        lunarDay: getLunarDay(date),
        lunarMonth: getLunarMonth(date),
      });
    }

    return newDays;
  });

  /** 整合task后的数据 */
  const completeData = computed(() => {
    return replenishCurrentDays.value.map((item) => {
      return {
        ...item,
        dataList: store.value.data[item.date] || [],
      };
    });
  });

  /** 对completeData的数据进行跨日期处理 */
  const formatData = computed(() => {
    const list = convertTo2DArray<TDate & { dataList: TData[] }>(completeData.value, 7);
    for (let i = 0; i < list.length; i++) {
      for (let j = 0; j < list[i].length; j++) {
        const { dataList } = list[i][j];
        if (!dataList) continue;
        for (let k = 0; k < dataList.length; k++) {
          const { end } = dataList[k];
          const start = isBefore(dataList[k].start, list[0][0].date) ? list[0][0].date : dataList[k].start;
          const interval = getTimeInterval({ bigDate: end, smallDate: start, unit: 'day' }) + 1;
          const offset = 7 - j;
          if (interval > offset && i < 5) {
            list[i + 1][0].dataList.push({
              ...dataList[k],
              start: getDate({ date: start, add: offset }),
            });
          }
        }
      }
    }
    // console.log('list=>', list);
    return list;
  });

  const onDragStart = (e: DragEvent, data?: TData) => {
    if (!taskBoxWidth.value || !data) return;

    dragData.targetFragmentStart = isBefore(completeData.value[0].date, data.start) ? data.start : completeData.value[0].date;
    dragData.targetEnd = data.end;
    dragData.targetId = data.id as number;
    dragData.offset = Math.floor(e.offsetX / taskBoxWidth.value);
    dragData.targetTask = findTaskById(dragData.targetId, store.value.data);
  };

  const onDragover = (e: DragEvent) => {
    e.preventDefault();
  };

  const onDrop = (e: DragEvent) => {
    dragData.targetDate = findDropTargetDate(e.target as HTMLElement);
    // console.log(dragData);
    if (!dragData.targetDate) return;

    // 去掉原来的数据
    for (const key in store.value.data) {
      if (store.value.data[key] && store.value.data[key].some((item) => item.id === dragData.targetId)) {
        store.value.data[key] = store.value.data[key].filter((item) => item.id !== dragData.targetId);
      }
    }

    /** 当前task片段的start与task的start的偏移天数 */
    const interval = getTimeInterval({
      bigDate: dragData.targetFragmentStart,
      smallDate: getDate({ date: dragData.targetTask!.start, format: 'YYYY-MM-DD' }),
      unit: 'day',
    });

    /** 鼠标点击的位置离这条task的start的偏移天数 */
    const clickOffset = interval + dragData.offset;
    // 添加新的数据
    const newTaskStart = getDate({ date: dragData.targetDate, add: -clickOffset, type: 'day', format: 'YYYY-MM-DD' });
    const key = isBefore(newTaskStart, completeData.value[0].date) ? completeData.value[0].date : newTaskStart;
    const taskOffset = getTimeInterval({ bigDate: newTaskStart, smallDate: dragData.targetTask!.start, unit: 'day' });
    console.log(taskOffset, 'ta');
    if (!store.value.data[key]) {
      store.value.data[key] = [];
    }

    const newTask = {
      id: dragData.targetId,
      name: dragData.targetTask!.name,
      start: newTaskStart,
      end: getDate({ date: dragData.targetTask!.end, add: taskOffset, type: 'day', format: 'YYYY-MM-DD' }),
    };
    console.log('newTask', newTask, 'key', key);
    store.value.data[key].push(newTask);
  };

  const selectedTask = (id: number) => {
    selectedTaskId.value = id;
  };

  return {
    // data
    replenishCurrentDays,
    completeData,
    formatData,
    taskBoxWidth,
    // fn
    onDragover,
    onDrop,
    onDragStart,
    // 选择任务
    selectedTaskId,
    selectedTask,
  };
};
