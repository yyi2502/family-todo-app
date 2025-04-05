"use client";

import { useRewardStore } from "@/stores/rewardStore";
import { AddRewardPropsType, RewardPropsType, RewardType } from "@/types";

export function useRewardActions() {
  const { refetchReward, setRefetchReward } = useRewardStore();
  // refetch用のトリガー
  const triggerRefetch = () => {
    setRefetchReward(!refetchReward); // 状態を反転させて再取得をトリガー
  };

  // Read--------------------------------
  // rewards 読み込み
  // ・全件
  // ・条件あり
  const fetchRewards = async ({ child_id, is_active }: RewardPropsType) => {
    try {
      const url = new URL("/api/reward", window.location.origin);

      if (child_id) url.searchParams.append("child_id", child_id);
      if (is_active !== undefined)
        url.searchParams.append("is_active", String(is_active));

      const response = await fetch(url.toString());
      const rewards = await response.json();
      if (!response.ok) throw new Error(rewards.error);

      return rewards;
    } catch (err) {
      console.error("rewardの取得に失敗しました", err);
      throw new Error("rewardの取得に失敗しました");
    }
  };

  // Read--------------------------------
  // reward1件読み込み
  const fetchOneReward = async (
    reward_id: string
  ): Promise<RewardType | undefined> => {
    try {
      const res = await fetch(`/api/reward/${reward_id}`);
      if (!res.ok) {
        throw new Error(`rewardデータ取得失敗: ${res.status}`);
      }
      const data = await res.json();
      return data;
    } catch (err) {
      console.error("rewardユーザーのデータ取得エラー:", err);
      return undefined;
    }
  };

  // ADD--------------------------------
  // reward追加

  // 使い方
  // const { addReward } = useRewardActions();
  // addReward({ ...data, parent_id: parentData?.id || "" }, ()=>{}}
  const addReward = async (
    newReward: AddRewardPropsType,
    onSuccess?: () => void
  ) => {
    try {
      const res = await fetch("/api/reward", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReward),
      });
      if (!res.ok) throw new Error("reward追加に失敗しました");

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error("追加エラー:", err);
    }
    triggerRefetch(); // 再取得トリガー
  };

  // UPDATE--------------------------------
  // reward の status 更新
  const updateReward = async (
    rewardId: string,
    newReward: {
      title?: string;
      description?: string | null;
      child_id?: string | null;
      required_points?: number;
      is_active?: boolean;
    },
    onSuccess?: () => void
  ) => {
    try {
      const res = await fetch(`/api/reward/${rewardId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReward), // 渡されたプロパティのみ更新
      });
      if (!res.ok) throw new Error("更新に失敗しました");

      triggerRefetch();
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("更新エラー:", err);
    }
  };

  // DELETE--------------------------------
  // reward の削除
  const deleteReward = async (rewardId: string, onSuccess?: () => void) => {
    if (!confirm("このリワードを削除しますか？")) return;
    try {
      const res = await fetch(`/api/reward/${rewardId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("削除に失敗しました");

      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("削除エラー:", err);
    }
    triggerRefetch();
  };

  return {
    addReward,
    fetchRewards,
    fetchOneReward,
    updateReward,
    deleteReward,
    triggerRefetch,
    refetchReward,
  };
}
