export type TDataInfo = {
  day: string;
  weekDay: string;
  dataList: unknown[];
};

export type TDate = {
  date: string;
  day?: string;
  lunarDay: string;
  lunarMonth: string;
  week: string;
  weekIndex: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isFirstDayOfMonth: boolean;
  isFirstDayOfLunarMonth?: boolean;
  isSaturdayOrSunday: boolean;
};

export type TYearDate = {
  date: string;
  day: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  isFirstDayOfLunarMonth: boolean;
  weekIndex: number;
  month: string;
};

/** 1:日 2:周 3:月 4:年 */
export enum ECalendarType {
  DAY = 1,
  WEEK,
  MONTH,
  YEAR,
}
