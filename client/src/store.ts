import type { FunctionComponent } from "react";
import { create } from "zustand";

interface State {
  startDate: Date | null;
  endDate: Date | null;
}

interface Action {
  setStartDate: (date: Date | null) => void;
  setEndDate: (date: Date | null) => void;
}

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

export type ModalComponent = FunctionComponent<{ onClose: () => void }>;

interface ModalState {
  modals: ModalComponent[];
}

interface ModalAction {
  openModal: (modal: FunctionComponent<{ onClose: () => void }>) => void;
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

export { store, useModalStore };
