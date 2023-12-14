import { computed, reactive, ref } from 'vue';
import { cloneDeep } from 'lodash';
import { getOneDayOfWeekDaysAndMonthDays, weeks, getWeekIndex, getDate, getLunarDay, getLunarMonth } from '@/date';
import { findDropTarget } from '@/utils';
import { TDate } from '@/types';

const periodViewList = ref<{ [key: string]: { id: number; name: string }[] }>({
  '2023-10-29': [
    { id: 12, name: '张三' },
    { id: 13, name: '李四' },
  ],
  '2023-12-01': [
    { id: 1, name: '张三' },
    { id: 2, name: '李四' },
  ],
  '2023-12-02': [
    { id: 3, name: '王五' },
    { id: 4, name: '赵六' },
  ],
  '2023-12-03': [
    { id: 5, name: '田七' },
    { id: 6, name: '周八' },
  ],
  '2023-12-04': [
    { id: 7, name: '吴九' },
    { id: 8, name: '郑十' },
    { id: 9, name: '吴九' },
    { id: 10, name: '郑十' },
    { id: 11, name: '吴九' },
  ],
});

const currentDays = ref(getOneDayOfWeekDaysAndMonthDays());
const dragData = reactive<{
  targetId: number;
  targetBox: string | null;
}>({
  targetId: 0,
  targetBox: '',
});

const selectedTaskId = ref(0);

export const useMonth = () => {
  /** 填满日历 */
  const replenishCurrentDays = computed((): TDate[] => {
    if (!currentDays.value.length) return [];
    const newDays = cloneDeep(currentDays.value);

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

  /** 完整的数据 */
  const completeData = computed(() => {
    return replenishCurrentDays.value.map((item) => {
      return {
        ...item,
        dataList: periodViewList.value[item.date],
      };
    });
  });

  const onDragStart = (e: DragEvent) => {
    dragData.targetId = Number((e.target as Element).getAttribute('data-id'));
  };

  const onDragover = (e: DragEvent) => {
    e.preventDefault();
  };

  const onDrop = (e: DragEvent) => {
    dragData.targetBox = findDropTarget(e.target as HTMLElement);
    if (!dragData.targetBox) return;

    // 去掉原来的数据
    for (const key in periodViewList.value) {
      if (periodViewList.value[key] && periodViewList.value[key].some((item) => item.id === dragData.targetId)) {
        periodViewList.value[key] = periodViewList.value[key].filter((item) => item.id !== dragData.targetId);
      }
    }
    // 添加新的数据
    if (!periodViewList.value[dragData.targetBox]) {
      periodViewList.value[dragData.targetBox] = [];
    }
    periodViewList.value[dragData.targetBox].push({ id: dragData.targetId, name: '111' });
  };

  const selectedTask = (id: number) => {
    selectedTaskId.value = id;
  };

  return {
    // data
    currentDays,
    replenishCurrentDays,
    completeData,
    periodViewList,
    // fn
    onDragover,
    onDrop,
    onDragStart,
    // 选择任务
    selectedTaskId,
    selectedTask,
  };
};
