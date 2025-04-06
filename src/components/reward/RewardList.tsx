"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/stores/userStore";
import { useRewardStore } from "@/stores/rewardStore";
import { RewardPropsType, RewardType } from "@/types";
import { Delete, Star } from "lucide-react";
import { useRewardActions } from "@/hooks/useRewardActions";
import ExchangeRewardModal from "./ExchangeRewardModal";
import UpdateRewardModal from "./UpdateRewardModal";

export default function RewardList({ child_id, is_active }: RewardPropsType) {
  const selectedUser = useUserStore((state) => state.selectedUser);
  const { refetchReward, setRefetchReward } = useRewardStore();
  const [rewards, setRewards] = useState<RewardType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { fetchRewards, deleteReward } = useRewardActions();

  // 初回ロード
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchRewards({ child_id, is_active });
        setRewards(data);
      } catch (err) {
        console.error(err);
        setError("rewardの取得に失敗しました");
      }
    };
    fetchData(); // 初回ロードで必ず取得
  }, [child_id, fetchRewards, is_active]);

  // rewardリストを取得
  useEffect(() => {
    const fetchData = async () => {
      console.log("fetchRewards");
      try {
        const data = await fetchRewards({ child_id, is_active });
        setRewards(data);
      } catch (err) {
        console.error(err);
        setError("rewardの取得に失敗しました");
      } finally {
        setRefetchReward(false); // フェッチ完了後、フラグをリセット
      }
    };
    if (refetchReward) {
      fetchData();
    }
  }, [refetchReward, setRefetchReward, child_id, fetchRewards, is_active]);

  // reward の削除
  const handleDelete = async (e: React.MouseEvent, rewardId: string) => {
    e.preventDefault();
    deleteReward(rewardId);
  };

  return (
    <div className="list bg-base-100 rounded-box shadow-md">
      {error && <p className="text-red-500">{error}</p>}
      {rewards.length > 0 ? (
        <ul>
          {rewards.map((reward) => (
            <li
              key={reward.id}
              className="list-row flex justify-between items-center"
            >
              <div>
                {reward.is_active && (
                  <div>
                    <Star />
                  </div>
                )}
                <div>{reward.title}</div>
                <div>{reward.required_points}</div>
                {reward.description && (
                  <div className="text-xs uppercase font-semibold opacity-60">
                    {reward.description}
                  </div>
                )}
              </div>

              <div className="flex gap-2 items-center">
                {selectedUser?.role === "child" ? (
                  <ExchangeRewardModal reward={reward} />
                ) : (
                  <>
                    <UpdateRewardModal rewardId={reward.id} />
                    <button
                      className="btn btn-square btn-ghost"
                      onClick={(e) => handleDelete(e, reward.id)}
                    >
                      <Delete />
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">ありません</p>
      )}
    </div>
  );
}
