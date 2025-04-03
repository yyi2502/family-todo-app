"use client";

import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/userStore";
import { useCallback } from "react";
import { useFetchChildren } from "./useFetchChildren";

export function useChildActions() {
  const router = useRouter();
  const setChildList = useUserStore((state) => state.setChildList);
  const { fetchChildren } = useFetchChildren();

  // UPDATE--------------------------------
  // 子ユーザー情報更新
  // fetchChild

  // 使い方
  // const { updateChild } = useChildActions();
  // updateChild(userid,{name:"",total_points:00}, ()=>{}}
  const updateChild = useCallback(
    async (
      childId: string,
      updates: {
        name?: string;
        total_points?: number;
      },
      onSuccess?: () => void
    ) => {
      try {
        const res = await fetch(`/api/child/${childId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates), // 渡されたプロパティのみ更新
        });
        if (!res.ok) throw new Error("更新に失敗しました");

        await fetchChildren(); // 最新の子リストを取得

        if (onSuccess) onSuccess(); // 成功時の処理
      } catch (err) {
        console.error("更新エラー:", err);
      }
    },
    [setChildList]
  );

  // DELETE--------------------------------
  // 子ユーザー情報削除
  // fetchChild

  // 使い方
  // const { deleteChild } = useChildActions();
  // deleteChild(userid)
  const deleteChild = useCallback(
    async (childId: string) => {
      if (!confirm("この子ユーザーを削除しますか？")) return;
      try {
        const response = await fetch(`/api/child/${childId}`, {
          method: "DELETE",
        });
        if (!response.ok) throw new Error("削除に失敗しました");

        await fetchChildren(); // 最新の子リストを取得

        router.push("/main/parent");
      } catch (err) {
        console.error("削除エラー:", err);
      }
    },
    [setChildList]
  );

  // ADD--------------------------------
  // 子ユーザー追加
  // fetchChild

  // 使い方
  // const { addChild } = useChildActions();
  // addChild({ ...data, parent_id: parentData?.id || "" }, ()=>{}}
  const addChild = useCallback(
    async (
      newUser: { name: string; parent_id: string },
      onSuccess?: () => void
    ) => {
      try {
        const res = await fetch("/api/child", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUser),
        });
        if (!res.ok) throw new Error("子ユーザー追加に失敗しました");

        await fetchChildren(); // 最新の子リストを取得

        if (onSuccess) {
          onSuccess();
        } // 成功時の処理
      } catch (err) {
        console.error("追加エラー:", err);
      }
    },
    [setChildList]
  );

  return { updateChild, deleteChild, addChild };
}
