"use client";

import { create } from "zustand";
type todoStoreType = {
  shouldRefetch: boolean;
  setShouldRefetch: (value: boolean) => void;
};

export const useTodoStore = create<todoStoreType>((set) => ({
  shouldRefetch: false,
  setShouldRefetch: (value) => set({ shouldRefetch: value }),
}));
