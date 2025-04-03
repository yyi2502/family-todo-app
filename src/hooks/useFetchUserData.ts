import { useEffect } from "react";
import { useUserStore } from "@/stores/userStore";
import { createClient } from "@/utils/supabase/client";

export const useFetchUserData = () => {
  const { fetchParentData, fetchChildrenData, clearUser } = useUserStore();

  useEffect(() => {
    const supabase = createClient();
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          console.log("✅ ログイン検知 → ユーザーデータ取得");
          const parent = fetchParentData(session.user.id);
          if (parent) {
            console.log("👨‍👩‍👧‍👦 親データ取得完了 → 子供データ取得開始");
            fetchChildrenData();
          }
        } else if (event === "SIGNED_OUT") {
          console.log("🚪 ログアウト検知 → ユーザーデータクリア");
          clearUser();
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [fetchParentData, fetchChildrenData, clearUser]);
};
