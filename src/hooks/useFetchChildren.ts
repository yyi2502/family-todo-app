"use client";

import { useCallback } from "react";
import { useUserStore } from "@/stores/userStore";

/**
 * 子ユーザー情報を取得し、storeへ保存
 */
export function useFetchChildren() {
  const setChildList = useUserStore((state) => state.setChildList);

  const fetchChildren = useCallback(async () => {
    console.log("fetch children 開始");

    try {
      const res = await fetch("/api/child");
      if (!res.ok) {
        throw new Error(`子ユーザーのデータ取得失敗: ${res.status}`);
      }
      const data = await res.json();
      setChildList(data.children);
      console.log("fetch children 完了", data.children);
    } catch (err) {
      console.error("子ユーザーのデータ取得エラー:", err);
    }
  }, [setChildList]);

  return { fetchChildren };
}
