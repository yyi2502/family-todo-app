"use client";

import { create } from "zustand";
import { TodoStoreType } from "@/types";

export const useTodoStore = create<TodoStoreType>((set) => ({
  refetchTodo: false,
  setRefetchTodo: (value) => set({ refetchTodo: value }),
}));
