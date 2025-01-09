export interface IDateRange {
  label: string;
  startDate: Date;
  endDate: Date;
}

export interface ICalendarLanguage {
  name: string;
  id: number;
  code: string;
}

export interface IMonthView {
  month: number;
  year: number;
  selectedDates: Date[];
  rangeStart?: Date;
  rangeEnd?: Date;
  defaultRange?: string;
  language: ICalendarLanguage;
}

export interface IDateObj {
  fullDate: Date;
  dateNumber: number;
  isOutOfMonth: boolean;
}
