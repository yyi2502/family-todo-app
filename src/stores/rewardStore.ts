"use client";

import { create } from "zustand";
import { RewardStoreType } from "@/types";

export const useRewardStore = create<RewardStoreType>((set) => ({
  refetchReward: false,
  setRefetchReward: (value) => set({ refetchReward: value }),
}));
