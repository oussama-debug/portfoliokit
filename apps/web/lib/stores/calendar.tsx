import { type Dayjs } from "dayjs";
import { create } from "zustand";
import { dayjs } from "../calendar";

interface CalendarState {
  selectedDate: Dayjs;
  view: "week" | "month";
  assist: boolean;

  setAssist: (assist: boolean) => void;

  setSelectedView: (view: "week" | "month") => void;
  setSelectedDate: (date: Dayjs) => void;
  reset: () => void;

  nextMonth: () => void;
  nextWeek: () => void;
  previousWeek: () => void;
  previousMonth: () => void;
}

export const useCalendarStore = create<CalendarState>((set) => ({
  selectedDate: dayjs(),
  view: "week",
  assist: false,

  setAssist: (assist: boolean) => set({ assist }),
  setSelectedView: (view: "week" | "month") => set({ view }),
  setSelectedDate: (date: Dayjs) => set({ selectedDate: date }),
  reset: () => set({ selectedDate: dayjs() }),

  nextMonth: () =>
    set((state) => ({
      selectedDate: state.selectedDate.add(1, "month"),
    })),
  nextWeek: () =>
    set((state) => ({
      selectedDate: state.selectedDate.add(1, "week"),
    })),
  previousWeek: () =>
    set((state) => ({
      selectedDate: state.selectedDate.subtract(1, "week"),
    })),
  previousMonth: () =>
    set((state) => ({
      selectedDate: state.selectedDate.subtract(1, "month"),
    })),
}));
