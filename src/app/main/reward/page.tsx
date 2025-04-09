"use client";

import { useUserStore } from "@/stores/userStore";
import AddRewardModal from "@/components/reward/AddRewardModal";
import RewardList from "@/components/reward/RewardList";

export default function RewardPage() {
  const selectedUser = useUserStore((state) => state.selectedUser);
  return (
    <>
      <div className="max-w-3xl mx-auto p-6 mb-10">
        <h2 className="text-center text-3xl mb-8">ポイントこうかん</h2>
        {selectedUser?.role === "parent" && <AddRewardModal />}
        <RewardList />
      </div>
    </>
  );
}
