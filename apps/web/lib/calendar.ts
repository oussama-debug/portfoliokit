import dayjs from "dayjs";
import weekOfYearPlugin from "dayjs/plugin/weekOfYear";
import advancedFormat from "dayjs/plugin/advancedFormat";

dayjs.extend(advancedFormat);
dayjs.extend(weekOfYearPlugin);

export const isCurrentDay = (day: dayjs.Dayjs) => {
  return day.isSame(dayjs(), "day");
};

export const isCurrentHour = (hour: number) => {
  return dayjs().hour() === hour;
};

export const getWeekDays = (date: dayjs.Dayjs) => {
  const startOfWeek = date.startOf("week");

  const weekDates = [];

  for (let i = 0; i < 7; i++) {
    const currentDate = startOfWeek.add(i, "day");
    weekDates.push({
      currentDate,
      today:
        currentDate.toDate().toDateString() === dayjs().toDate().toDateString(),
      isCurrentDay,
    });
  }

  return weekDates;
};

export const getHours = Array.from({ length: 24 }, (_, i) =>
  dayjs().startOf("day").add(i, "hour")
);

export const getWeeks = (monthIndex: number) => {
  const year = dayjs().year();
  const firstDayOfMonth = dayjs(new Date(year, monthIndex, 1));
  const lastDayOfMonth = dayjs(new Date(year, monthIndex + 1, 0));

  const weeks: number[] = [];

  let currentDay = firstDayOfMonth;
  while (
    currentDay.isBefore(lastDayOfMonth) ||
    currentDay.isSame(lastDayOfMonth)
  ) {
    const weekNumber = currentDay.week();
    if (!weeks.includes(weekNumber)) {
      weeks.push(weekNumber);
    }
    currentDay = currentDay.add(1, "day");
  }

  return weeks;
};

export { dayjs };
