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
export const findDropTarget = (element: HTMLElement): string | null => {
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
