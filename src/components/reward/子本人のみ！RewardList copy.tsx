"use client";

import { useUserStore } from "@/stores/userStore";
import { RewardType, TodoType } from "@/types";
import { Delete, Pencil } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { NameDisplay } from "../user/NameDisplay";
import { useParams } from "next/navigation";
import UseRewardModal from "./UseRewardModal";

export default function RewardList() {
  // const { id } = useParams();
  const selectedUser = useUserStore((state) => state.selectedUser);

  const [rewards, setRewards] = useState<RewardType[]>([]);
  const [error, setError] = useState<string | null>(null);

  // const isSelf = selectedUser?.id === id;
  // console.log("+++++++");
  // console.log(isSelf);

  // rewardリストを取得
  useEffect(() => {
    const fetchReward = async () => {
      try {
        const response = await fetch(`/api/rewards`);
        const rewardData = await response.json();
        if (response.ok) {
          setRewards(rewardData.data);
        } else {
          setError(rewardData.error);
        }
      } catch (err) {
        setError("エラーが発生しました。");
      }
    };

    fetchReward();
  }, []);

  // useEffect(() => {
  //   fetchRewards();
  //   // }, [rewards]);
  // }, []);

  // const fetchRewards = async () => {
  //   try {
  //     const rewards = await fetchAllRewards(true);

  //     try {
  //       const url = new URL("/api/reward", window.location.origin);

  //       const response = await fetch(url.toString());
  //       const rewards = await response.json();
  //       if (!response.ok) throw new Error(rewards.error);

  //       return rewards;
  //     } catch (err) {
  //       console.error("rewardsの取得に失敗しました", err);
  //       throw new Error("rewardsの取得に失敗しました");
  //     }

  //     setRewards(rewards);
  //   } catch {
  //     setError("ToDoの取得に失敗しました");
  //   }
  // };

  // Reward更新
  // const handleExchange = async (
  //   rewardId: string
  //   // newStatus: "pending" | "processing" | "completed",
  //   // points?: number
  // ) => {
  //   try {
  //     const response = await fetch(`/api/rewards/${rewardId}`, {
  //       method: "PUT",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({}),
  //     });

  //     if (!response.ok) throw new Error("ステータス更新に失敗しました");

  //     setRewards((prevRewards) =>
  //       prevRewards.map((rewards) =>
  //         rewards.id === rewardId ? { ...rewards } : rewards
  //       )
  //     );

  //     // ToDo が完了した場合、total_point を更新
  //     // if (newStatus === "completed" && points !== undefined) {
  //     //   await updateTotalPoints(points);
  //     // }
  //   } catch (err) {
  //     setError("ステータス更新に失敗しました~");
  //     console.error(err);
  //   }
  // };
  // total_point の更新
  // const updateTotalPoints = async (todoPoints: number) => {
  //   try {
  //     const response = await fetch(`/api/user/${child_id}`, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         points: todoPoints, // 加算するポイント数
  //       }),
  //     });

  //     if (!response.ok) throw new Error("ポイントの更新に失敗しました");
  //   } catch (err) {
  //     setError("ポイントの更新に失敗しました");
  //     console.error(err);
  //   }
  // };

  // Reward 交換
  const handleExchange = async (rewardId: string) => {
    try {
      const response = await fetch(`/api/rewards/${rewardId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      if (!response.ok) throw new Error("ステータス更新に失敗しました");

      setRewards((prevRewards) =>
        prevRewards.map((rewards) =>
          rewards.id === rewardId ? { ...rewards } : rewards
        )
      );

      // ToDo が完了した場合、total_point を更新
      // if (newStatus === "completed" && points !== undefined) {
      //   await updateTotalPoints(points);
      // }
    } catch (err) {
      setError("ステータス更新に失敗しました~");
      console.error(err);
    }
  };

  // rewards の削除
  const handleDelete = async (rewardId: string) => {
    if (!confirm("このリワードを削除しますか？")) return;
    try {
      const response = await fetch(`/api/reward/${rewardId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("削除に失敗しました");

      setRewards((prevRewards) =>
        prevRewards.filter((reward) => reward.id !== rewardId)
      );
    } catch (err) {
      setError("削除に失敗しました");
      console.error(err);
    }
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
                <div>{reward.title}</div>
                <div>必要ポイント：{reward.required_points}</div>
                {reward.description && (
                  <div className="text-sm">{reward.description}</div>
                )}
              </div>
              <div className="flex gap-2">
                {/* 子本人のみ 交換ボタン表示 */}
                {isSelf && (
                  <>
                    <UseRewardModal />
                    {/* <button
                      className="btn btn-sm bg-blue-500 text-white"
                      onClick={() => handleUse(reward.id)}
                    >
                      つかう！
                    </button> */}
                  </>
                )}

                {/* 親ユーザーのみ 編集・削除ボタン表示 */}
                {selectedUser?.role === "parent" && (
                  <>
                    <Link href={`/main/reward/${reward.id}`}>
                      <button className="btn btn-square btn-ghost">
                        <Pencil />
                      </button>
                    </Link>
                    <button
                      className="btn btn-square btn-ghost"
                      onClick={() => handleDelete(reward.id)}
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
