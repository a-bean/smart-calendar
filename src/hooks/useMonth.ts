import { computed, reactive, ref } from 'vue';
import { cloneDeep } from 'lodash';
import { weeks, getWeekIndex, getDate, getLunarDay, getLunarMonth } from '@/date';
import { findDropTarget } from '@/utils';
import { TData, TDate } from '@/types';

const periodViewList = ref<{ [key: string]: TData[] }>({
  '2023-12-04': [
    { id: 7, name: '吴九', start: '2023-12-03 08:00:00', end: '2023-12-04 09:00:00' },
    // { id: 8, name: '郑十', start: '2023-12-04 09:00:00', end: '2023-12-06 10:00:00' },
  ],
  // '2023-12-05': [
  //   { id: 27, name: '吴九', start: '2023-12-05 08:00:00', end: '2023-12-05 09:00:00' },
  //   { id: 28, name: '吴九', start: '2023-12-05 08:00:00', end: '2023-12-05 09:00:00' },
  // ],
  // '2023-12-06': [
  //   { id: 17, name: '吴九', start: '2023-12-06 08:00:00', end: '2023-12-07 09:00:00' },
  //   { id: 18, name: '郑十', start: '2023-12-05 09:00:00', end: '2023-12-05 10:00:00' },
  //   { id: 19, name: '吴九', start: '2023-12-05 10:00:00', end: '2023-12-05 11:00:00' },
  //   { id: 20, name: '郑十', start: '2023-12-05 11:00:00', end: '2023-12-05 12:00:00' },
  //   { id: 21, name: '吴九', start: '2023-12-05 12:00:00', end: '2023-12-05 13:00:00' },
  // ],
  // '2023-12-07': [{ id: 22, name: '吴九', start: '2023-12-06 08:00:00', end: '2023-12-07 09:00:00' }],
});

const taskBoxWidth = ref<number>(); // 记录任务盒子的宽度
const taskMouseOffset = ref<number>(); // 记录鼠标在任务盒子中的偏移量

const currentDays = ref<TDate[]>([]);
const dragData = reactive<{
  targetId: number;
  targetDate: string | null;
}>({
  targetId: 0,
  targetDate: '',
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
    if (!taskBoxWidth.value) return;
    taskMouseOffset.value = Math.floor(e.offsetX / taskBoxWidth.value);

    dragData.targetId = Number((e.target as Element).getAttribute('data-id'));
  };

  const onDragover = (e: DragEvent) => {
    e.preventDefault();
  };

  const onDrop = (e: DragEvent) => {
    dragData.targetDate = findDropTarget(e.target as HTMLElement);
    if (!dragData.targetDate) return;

    // 去掉原来的数据
    for (const key in periodViewList.value) {
      if (periodViewList.value[key] && periodViewList.value[key].some((item) => item.id === dragData.targetId)) {
        periodViewList.value[key] = periodViewList.value[key].filter((item) => item.id !== dragData.targetId);
      }
    }
    // 添加新的数据
    const key = getDate({ date: dragData.targetDate, add: -taskMouseOffset.value!, type: 'day', format: 'YYYY-MM-DD' });
    if (!periodViewList.value[key]) {
      periodViewList.value[key] = [];
    }

    periodViewList.value[key].push({
      id: dragData.targetId,
      name: '111',
      start: '2023-12-04 08:00:00',
      end: '2023-12-05 09:00:00',
    });
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
