"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserType } from "@/types";
import { createClient } from "@/utils/supabase/client";

type UserState = {
  parentData: UserType | null; // 親ユーザーデータ
  selectedUser?: UserType | null | undefined; // 選択中のユーザー
  childList: UserType[]; // 子ユーザーリスト
  setParentData: (parentData: UserType | null) => void; // 親ユーザーデータ設定
  setSelectedUser: (id: string) => void; // 選択中のユーザー設定
  setChildList: (childList: UserType[]) => void; // 子ユーザーリスト設定
  fetchParentData: (userId: string) => void;
  fetchChildrenData: () => void;
  clearUser: () => void; // ユーザーデータクリア
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      parentData: null,
      selectedUser: null,
      childList: [],

      setParentData: (parentData) => set({ parentData }),

      setChildList: (childList) => set({ childList }),

      setSelectedUser: (id) => {
        const { parentData, childList } = get();

        // 親ユーザーのIDと一致したら、parentDataをそのままセット
        if (parentData?.id === id) {
          set({ selectedUser: parentData });
          return;
        }

        // 子ユーザーの中から一致するIDを探す
        const child = childList.find((c) => c.id === id);
        if (child) {
          set({ selectedUser: child });
          return;
        }

        // どちらにも該当しない場合は null をセット
        set({ selectedUser: null });
      },

      fetchParentData: async (userId) => {
        console.log("親データ取得fetchParentData:", userId);
        const supabase = createClient();
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("user_id", userId)
          .single();

        if (!error) {
          console.error("fetchParentData エラー:", error);
          return null;
        }
        set({ parentData: data });
        return data; // ここで `return` するのがポイント！
      },

      fetchChildrenData: async () => {
        try {
          const res = await fetch("/api/child");
          if (!res.ok) {
            throw new Error(`子ユーザーのデータ取得失敗: ${res.status}`);
          }
          const data = await res.json();
          set({ childList: data });
          console.log("fetch children 完了", data);
        } catch (err) {
          console.error("子ユーザーのデータ取得エラー:", err);
        }
      },

      clearUser: () =>
        set({
          parentData: null,
          childList: [],
          selectedUser: null,
        }),
    }),
    {
      name: "user-storage",
      partialize: (state) => ({
        parentData: state.parentData,
        selectedUser: state.selectedUser,
        childList: state.childList,
      }),
    }
  )
);
