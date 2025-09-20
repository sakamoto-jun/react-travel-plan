import { create } from "zustand";

interface State {
  startDate: Date | null;
  endDate: Date | null;
}

type Action = {
  setStartDate: (date: Date | null) => void;
  setEndDate: (date: Date | null) => void;
};

const store = create<State & Action>()((set) => ({
  startDate: null,
  endDate: null,
  setStartDate: (date) => {
    if (!date) {
      set({ startDate: null, endDate: null });
      return;
    }
    set({ startDate: date });
  },
  setEndDate: (date) => {
    if (!date) {
      set({ endDate: null });
      return;
    }
    set((state) => {
      if (state.startDate && date < state.startDate) {
        return { endDate: null };
      }
      return { endDate: date };
    });
  },
}));

export default store;
