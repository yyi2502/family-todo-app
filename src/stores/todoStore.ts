"use client";

import { create } from "zustand";
type todoStoreType = {
  refetchTodo: boolean;
  setRefetchTodo: (value: boolean) => void;
};

export const useTodoStore = create<todoStoreType>((set) => ({
  refetchTodo: false,
  setRefetchTodo: (value) => set({ refetchTodo: value }),
}));
