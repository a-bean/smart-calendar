import { computed, ref } from 'vue';
import { ETaskMoveType, ONE_HOUR_HEIGHT } from '@/config';
import { getTimeInterval, getDate } from '@/date';
import { useStore } from '@/hooks/useStore';
import { formatWeekTask } from '@/utils';
import { TData } from '@/types';

const MIN_HEIGHT = 15;
const BEST_TIME_SCALE = 15;
const taskBodyHeight = ref(0);
const { store, onTaskChange } = useStore();

export const useWeek = () => {
  const formatDataWeekData = computed(() => {
    return formatWeekTask(store.value.data);
  });

  let isDragging = false;
  let initialY: number;
  let targetId: number;
  let moveType: ETaskMoveType;

  const changeMoveType = (type: ETaskMoveType) => {
    moveType = type;
  };

  const mousemove = (e: MouseEvent) => {
    if (!isDragging) return;

    // 滑动后调整开始或者结束时间，将时间的 分钟 总是调整为15的的倍数
    let target: TData;
    for (const dataKey in store.value.data) {
      if (!Object.prototype.hasOwnProperty.call(store.value.data, dataKey)) continue;
      // eslint-disable-next-line no-loop-func
      const targetData = store.value.data[dataKey].find((item) => item.id === targetId);
      if (targetData) {
        target = targetData;
        break;
      }
    }

    const everyPxOfMinute = 60 / (taskBodyHeight.value * (ONE_HOUR_HEIGHT / 100));
    const incrementalTime = everyPxOfMinute * (e.clientY - initialY);

    const timesDiff = getTimeInterval({ bigDate: target!.end, smallDate: target!.start, unit: 'minute' });
    if (timesDiff <= MIN_HEIGHT && e.clientY > initialY && moveType === ETaskMoveType.MOVE_TOP) return;
    if (timesDiff <= MIN_HEIGHT && e.clientY < initialY && moveType === ETaskMoveType.MOVE_BOTTOM) return;

    const adjustTime = (prop: 'start' | 'end') => {
      target[prop] = getDate({ date: target[prop], add: incrementalTime, type: 'minute', format: 'YYYY-MM-DD HH:mm' });
    };
    if (moveType === ETaskMoveType.MOVE_TOP || moveType === ETaskMoveType.MOVE_WHOLE) {
      adjustTime('start');
    }
    if (moveType === ETaskMoveType.MOVE_BOTTOM || moveType === ETaskMoveType.MOVE_WHOLE) {
      adjustTime('end');
    }

    initialY = e.clientY;
  };

  const mouseup = () => {
    isDragging = false;

    // 滑动后调整开始或者结束时间，将时间的 分钟 总是调整为15的的倍数
    let target: TData;
    for (const dataKey in store.value.data) {
      if (!Object.prototype.hasOwnProperty.call(store.value.data, dataKey)) continue;
      // eslint-disable-next-line no-loop-func
      const targetData = store.value.data[dataKey].find((item) => item.id === targetId);
      if (targetData) {
        target = targetData;
        break;
      }
    }
    const oldDate = JSON.parse(JSON.stringify(target!));
    const startRemainder = Number(getDate({ date: target!.start, format: 'mm' })) % BEST_TIME_SCALE;
    const endRemainder = Number(getDate({ date: target!.end, format: 'mm' })) % BEST_TIME_SCALE;
    const adjustTime = (remainder: number, prop: 'start' | 'end') => {
      const adjustValue = remainder < Math.round(BEST_TIME_SCALE / 2) ? -remainder : BEST_TIME_SCALE - remainder;
      target[prop] = getDate({ date: target[prop], add: adjustValue, type: 'minute', format: 'YYYY-MM-DD HH:mm' });
    };
    if (moveType === ETaskMoveType.MOVE_TOP || moveType === ETaskMoveType.MOVE_WHOLE) {
      adjustTime(startRemainder, 'start');
    }
    if (moveType === ETaskMoveType.MOVE_BOTTOM || moveType === ETaskMoveType.MOVE_WHOLE) {
      adjustTime(endRemainder, 'end');
    }

    // 如果时间有变化，触发回调
    if (oldDate.start !== target!.start || oldDate.end !== target!.end) {
      onTaskChange.value?.(target!);
    }

    window.removeEventListener('mouseup', mouseup);
    window.removeEventListener('mousemove', mousemove);
  };

  const mousedown = (e: MouseEvent, id: number, type: ETaskMoveType) => {
    targetId = id;
    isDragging = true;
    initialY = e.clientY;

    changeMoveType(type);

    window.addEventListener('mouseup', mouseup);
    window.addEventListener('mousemove', mousemove);
  };

  const mouseenter = (type: ETaskMoveType) => {
    if (moveType === ETaskMoveType.MOVE_WHOLE) return;
    changeMoveType(type);
  };

  return {
    formatDataWeekData,
    taskBodyHeight,
    mousedown,
    mousemove,
    mouseup,
    mouseenter,
    changeMoveType,
  };
};
