"use client";

import { useUserStore } from "@/stores/userStore";
import AddRewardModal from "@/components/reward/AddRewardModal";
import RewardList from "@/components/reward/RewardList";

export default function RewardPage() {
  const selectedUser = useUserStore((state) => state.selectedUser);
  return (
    <>
      {selectedUser?.role === "parent" && <AddRewardModal />}
      <RewardList />
    </>
  );
}
