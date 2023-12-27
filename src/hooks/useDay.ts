import { ref } from 'vue';
import { ETaskMoveType, ONE_HOUR_HEIGHT } from '@/config';
import { getTimeInterval, getDate } from '@/date';
import { TData } from '@/types';

const MIN_HEIGHT = 15;
const BEST_TIME_SCALE = 15;
const selectedTaskId = ref(0);
const taskBodyHeight = ref(0);
const mockData = ref<TData[]>([
  {
    id: 2,
    name: '新建日程',
    start: '2021-08-01 2:00',
    end: '2021-08-01 4:00',
  },
  {
    id: 3,
    name: '新建日程',
    start: '2021-08-01 3:00',
    end: '2021-08-01 5:00',
  },
  {
    id: 8,
    name: '新建日程',
    start: '2021-08-01 3:30',
    end: '2021-08-01 5:00',
  },
  {
    id: 4,
    name: '新建日程',
    start: '2021-08-01 5:00',
    end: '2021-08-01 6:00',
  },
  {
    id: 5,
    name: '新建日程',
    start: '2021-08-01 5:00',
    end: '2021-08-01 7:00',
  },
  {
    id: 6,
    name: '新建日程',
    start: '2021-08-01 10:00',
    end: '2021-08-01 11:00',
  },
  {
    id: 7,
    name: '新建日程',
    start: '2021-08-01 11:00',
    end: '2021-08-01 12:00',
  },
]);

export const useDay = () => {
  const selectedTask = (id: number) => {
    selectedTaskId.value = id;
  };

  let isDragging = false;
  let initialY: number;
  let targetId: number;
  let moveType: ETaskMoveType;

  const changeMoveType = (type: ETaskMoveType) => {
    moveType = type;
  };

  const mousemove = (e: MouseEvent) => {
    if (!isDragging) return;
    const target = mockData.value.find((item) => item.id === targetId)!;
    const everyPxOfMinute = 60 / (taskBodyHeight.value * (ONE_HOUR_HEIGHT / 100));
    const incrementalTime = everyPxOfMinute * (e.clientY - initialY);

    const timesDiff = getTimeInterval({ bigDate: target.end, smallDate: target.start, unit: 'minute' });
    if (timesDiff <= MIN_HEIGHT && e.clientY > initialY && moveType === ETaskMoveType.MOVE_TOP) return;
    if (timesDiff <= MIN_HEIGHT && e.clientY < initialY && moveType === ETaskMoveType.MOVE_BOTTOM) return;

    const adjustTime = (prop: 'start' | 'end') => {
      target[prop] = getDate({ date: target[prop], add: incrementalTime, type: 'minute', format: 'YYYY-MM-DD HH:mm:ss' });
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
    const target = mockData.value.find((item) => item.id === targetId)!;
    const startRemainder = Number(getDate({ date: target.start, format: 'mm' })) % BEST_TIME_SCALE;
    const endRemainder = Number(getDate({ date: target.end, format: 'mm' })) % BEST_TIME_SCALE;
    const adjustTime = (remainder: number, prop: 'start' | 'end') => {
      const adjustValue = remainder < Math.round(BEST_TIME_SCALE / 2) ? -remainder : BEST_TIME_SCALE - remainder;
      target[prop] = getDate({ date: target[prop], add: adjustValue, type: 'minute', format: 'YYYY-MM-DD HH:mm:ss' });
    };
    if (moveType === ETaskMoveType.MOVE_TOP || moveType === ETaskMoveType.MOVE_WHOLE) {
      adjustTime(startRemainder, 'start');
    }
    if (moveType === ETaskMoveType.MOVE_BOTTOM || moveType === ETaskMoveType.MOVE_WHOLE) {
      adjustTime(endRemainder, 'end');
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
    taskBodyHeight,
    mockData,
    selectedTask,
    selectedTaskId,
    mousedown,
    mousemove,
    mouseup,
    mouseenter,
    changeMoveType,
  };
};
