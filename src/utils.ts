import { TData, TDate } from '@/types';

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

export const countItemsWithId = (idToCount: number, data: (TDate & { dataList: TData[] })[][]): number => {
  let count = 0;
  data.flat().forEach((item) => {
    item.dataList.forEach((d) => {
      if (d.id === idToCount) {
        count++;
      }
    });
  });
  return count;
};

const doSchedulesOverlap = (schedule1: TData, schedule2: TData) => {
  const start1 = new Date(schedule1.start).getTime();
  const end1 = new Date(schedule1.end).getTime();
  const start2 = new Date(schedule2.start).getTime();
  const end2 = new Date(schedule2.end).getTime();
  return start1 < end2 && end1 > start2;
};

export const groupSchedulesByOverlap = (schedules?: TData[]) => {
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
