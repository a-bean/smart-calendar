import { TData } from '@/types';
import { getDate, getTimeInterval } from '@/date';

/**
 * @function: convertTo2DArray
 * @description: 将一个数组分成多个指定大小的块
 * @param {Object} arr
 * @param {number} chunkSize
 * @return {T[][]}
 */
export const convertTo2DArray = <T>(arr: T[], chunkSize: number): T[][] => {
  const result = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    result.push(arr.slice(i, i + chunkSize));
  }
  return result;
};

/**
 * @function : findDropTarget
 * @description : 找到最近有'data-date'属性的元素，返回其'data-date'属性值
 * @param {HTMLElement} element
 * @return {string | null}
 */
export const findDropTargetDate = (element: HTMLElement): string | null => {
  // 检查当前元素是否是 #dropTarget 或其子元素
  if (element.getAttribute('data-date')) {
    return element.getAttribute('data-date');
  }
  // 逐级向上查找祖先元素，直到找到 #dropTarget
  while (element.parentElement) {
    element = element.parentElement;
    if (element.getAttribute('data-date')) {
      return element.getAttribute('data-date');
    }
  }
  // 如果未找到 #dropTarget，返回 null
  return null;
};
/**
 * @function : generateUUID
 * @description : 生成一个uuid
 * @return {string}
 */
export const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.floor(Math.random() * 16);
    const v = c === 'x' ? r : (r % 4) + 8;
    return v.toString(16);
  });
};

/**
 * @function : typeOf
 * @description : 返回数据类型
 * @param {unknown} obj
 * @return {string}
 */
export const typeOf = (obj: unknown): string => {
  let res = Object.prototype.toString.call(obj).split(' ')[1];
  res = res.substring(0, res.length - 1).toLowerCase();
  return res;
};

/**
 * @function : findTaskById
 * @description : 找到指定id的任务
 * @param {number} idToFind
 * @param {{ [key: string]: TData[] }} data
 * @return {TData | null}
 */
export const findTaskById = (idToFind: number, data: { [key: string]: TData[] }) => {
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const objects = data[key];
      const foundObject = objects.find((obj) => obj.id === idToFind);
      if (foundObject) {
        return foundObject;
      }
    }
  }
  return null;
};

const doSchedulesOverlap = (schedule1: TData, schedule2: TData) => {
  const start1 = new Date(schedule1.start).getTime();
  const end1 = new Date(schedule1.end).getTime();
  const start2 = new Date(schedule2.start).getTime();
  const end2 = new Date(schedule2.end).getTime();
  return start1 < end2 && end1 > start2;
};

/**
 * @function : groupSchedulesByOverlap
 * @description : 将重叠的任务分组
 * @param {TData[]} schedules
 * @return {TData[][]}
 */
export const groupSchedulesByOverlap = (schedules?: TData[]): TData[][] => {
  const result: TData[][] = [];

  if (!schedules) {
    return result;
  }

  for (let i = 0; i < schedules.length; i++) {
    const resultIds = result.flat().map((item) => item.id);
    if (resultIds.includes(schedules[i].id)) {
      continue;
    }
    const arr: TData[] = [schedules[i]];
    for (let j = i + 1; j < schedules.length; j++) {
      const overlappingSchedule = doSchedulesOverlap(schedules[i], schedules[j]);
      if (!resultIds.includes(schedules[j].id) && overlappingSchedule) {
        arr.push(schedules[j]);
      }
    }
    result.push(arr);
  }
  return result;
};

/**
 * @function : formatWeekTask
 * @description : 格式化数据：将数据按照时间段分组
 * @param {{ [key: string]: TData[] }} events
 * @return {{ [key: string]: TData[] }}
 * @example
 *  {
 *   '2024-01-21': [ { id: 14, name: '库里', start: '2024-01-21 03:00:00', end: '2024-01-22 07:00:00' },],
 *   '2024-01-22': [{ id: 15, name: '库里', start: '2024-01-22 00:00:00', end: '2024-01-22 06:00:00' }]
 *  } 转化成 ==>
 *  {
 *   '2024-01-21': [ { id: 14, name: '库里', start: '2024-01-21 03:00:00', end: '2024-01-22 00:00:00' },],
 *   '2024-01-22': [
 *     { id: 14, name: '库里', start: '2024-01-22 00:00:00', end: '2024-01-22 07:00:00' },
 *     { id: 15, name: '库里', start: '2024-01-22 00:00:00', end: '2024-01-22 06:00:00' }
 *   ]
 *  }
 */
export const formatWeekTask = (events: { [key: string]: TData[] }): { [key: string]: TData[] } => {
  const dataCopy: { [key: string]: TData[] } = JSON.parse(JSON.stringify(events));

  for (const date in dataCopy) {
    if (!Object.prototype.hasOwnProperty.call(dataCopy, date)) {
      continue;
    }

    for (let i = 0; i < dataCopy[date].length; i++) {
      let interval = getTimeInterval({ bigDate: dataCopy[date][i].end, smallDate: dataCopy[date][i].start, unit: 'day' });
      let add = 1;
      while (interval > 0) {
        const oldEnd = dataCopy[date][i].end;
        const nextDayKey = getDate({ date: dataCopy[date][i].start, add, type: 'day', format: 'YYYY-MM-DD' });
        // 如果不存在下一天的数据，就创建一个
        if (!dataCopy[nextDayKey]) {
          dataCopy[nextDayKey] = [];
        }
        // 已经存在相同的id项了，说明是同一个任务，只是跨天了
        if (dataCopy[nextDayKey].some((item) => item.id === dataCopy[date][i].id)) {
          const targetIndex = dataCopy[nextDayKey].findIndex((item) => item.id === dataCopy[date][i].id);
          dataCopy[nextDayKey][targetIndex] = {
            ...dataCopy[date][i],
            start: getDate({ date: dataCopy[date][i].end, format: 'YYYY-MM-DD 00:00:00' }),
            end: oldEnd,
            hidden: true,
          };
        } else {
          // 不存在相同的id项，说明是不同的任务，需要新增
          dataCopy[nextDayKey].unshift({
            ...dataCopy[date][i],
            start: getDate({ date: dataCopy[date][i].end, format: 'YYYY-MM-DD 00:00:00' }),
            end: oldEnd,
            hidden: true,
          });
        }
        interval--;
        add++;
      }
    }
  }
  return dataCopy;
};
