import { addDays, differenceInDays } from "date-fns";
import type { FunctionComponent } from "react";
import { create } from "zustand";

interface State {
  startDate: Date | null;
  endDate: Date | null;
  status: "period_edit" | "planning";
  dailyTimes: { startTime: string; endTime: string; date: Date }[];
}

interface Action {
  setStartDate: (date: Date | null) => void;
  setEndDate: (date: Date | null) => void;
  setStatus: (status: State["status"]) => void;
  setDailyTimes: (
    index: number,
    time: string,
    type: "startTime" | "endTime"
  ) => void;
}

const usePlanStore = create<State & Action>()((set, get) => ({
  startDate: null,
  endDate: null,
  status: "period_edit",
  dailyTimes: [],
  setStartDate: (date) => {
    if (!date) {
      set({ startDate: null, endDate: null });
      return;
    }
    set({ startDate: date });
  },
  setEndDate: (date) => {
    if (!date) {
      set({ endDate: null, dailyTimes: [] });
      return;
    }

    const startDate = get().startDate!;
    const diffDays = differenceInDays(date, startDate) + 1; // +1 추가 (시작일 포함)
    const dailyTimes = Array.from({ length: diffDays }, (_, i) => {
      return {
        startTime: "10:00",
        endTime: "22:00",
        date: addDays(startDate, i),
      };
    });

    set((state) => {
      if (state.startDate && date < state.startDate) {
        return { endDate: null, dailyTimes: [] };
      }
      return { endDate: date, dailyTimes };
    });
  },
  setStatus: (status: State["status"]) => {
    set({ status });
  },
  setDailyTimes: (index, time, type) => {
    set((state) => {
      const updatedDailyTimes = state.dailyTimes.map((dailyTime, i) => ({
        ...dailyTime,
        [type]: i === index ? time : dailyTime[type],
      }));
      return { dailyTimes: updatedDailyTimes };
    });
  },
}));

type ModalComponent = FunctionComponent<{ onClose: () => void }>;

interface ModalState {
  modals: ModalComponent[];
}

interface ModalAction {
  openModal: (modal: ModalComponent) => void;
  closeModal: (index: number) => void;
}

const useModalStore = create<ModalState & ModalAction>()((set) => ({
  modals: [],
  openModal: (modal) => {
    set((state) => ({
      modals: [...state.modals, modal],
    }));
  },
  closeModal: (index) => {
    set((state) => ({
      modals: state.modals.filter((_, i) => i !== index),
    }));
  },
}));

export { useModalStore, usePlanStore };
