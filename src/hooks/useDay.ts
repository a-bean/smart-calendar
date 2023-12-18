import { ref } from 'vue';
import { ETaskMoveType } from '@/config';
import { getTimeInterval, getDate } from '@/date';

const MIN_HEIGHT = 15;
const selectedTaskId = ref(0);
const taskBodyHeight = ref(0);
const mockData = ref([
  {
    id: 2,
    title: '新建日程',
    startTime: '2021-08-01 12:12',
    endTime: '2021-08-01 14:12',
    color: 'red',
  },
  {
    id: 3,
    title: '新建日程',
    startTime: '2021-08-01 04:12',
    endTime: '2021-08-01 08:12',
    color: 'green',
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
    console.log('mousemove');
    if (!isDragging) return;
    const target = mockData.value.find((item) => item.id === targetId)!;

    const everyPxOfMinute = (taskBodyHeight.value * 0.08) / 60;
    const incrementalTime = everyPxOfMinute * (e.clientY - initialY);
    const timesDiff = getTimeInterval({ bigDate: target.endTime, smallDate: target.startTime, unit: 'minute' });

    if (timesDiff <= MIN_HEIGHT && e.clientY > initialY && moveType === ETaskMoveType.MOVE_TOP) return;
    if (timesDiff <= MIN_HEIGHT && e.clientY < initialY && moveType === ETaskMoveType.MOVE_BOTTOM) return;

    if (moveType === ETaskMoveType.MOVE_TOP || moveType === ETaskMoveType.MOVE_WHOLE) {
      target.startTime = getDate({
        date: target.startTime,
        add: incrementalTime,
        type: 'minute',
        format: 'YYYY-MM-DD HH:mm:ss',
      });
    }

    if (moveType === ETaskMoveType.MOVE_BOTTOM || moveType === ETaskMoveType.MOVE_WHOLE) {
      target.endTime = getDate({
        date: target.endTime,
        add: incrementalTime,
        type: 'minute',
        format: 'YYYY-MM-DD HH:mm:ss',
      });
    }

    initialY = e.clientY;
  };

  const mouseup = () => {
    isDragging = false;

    window.removeEventListener('mouseup', mouseup);
    window.removeEventListener('mousemove', mousemove);
  };

  const mousedown = (e: MouseEvent, id: number, type: ETaskMoveType) => {
    targetId = id;
    isDragging = true;
    initialY = e.clientY;

    console.log(isDragging);
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
