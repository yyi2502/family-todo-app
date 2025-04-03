"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/userStore";
import { useFetchChildren } from "@/hooks/useFetchChildren";
import { createClient } from "@/utils/supabase/client";

/**
 * 親ユーザー情報を取得し、storeへ保存
 */
export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const parentData = useUserStore((state) => state.parentData);
  const setParentData = useUserStore((state) => state.setParentData);
  const clearUser = useUserStore((state) => state.clearUser);
  const { fetchChildren } = useFetchChildren();

  useEffect(() => {
    const supabase = createClient();
    const fetchParentData = async (userId: string) => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();
      if (error) {
        console.error("ユーザーデータ取得失敗:", error.message);
        return;
      }
      setParentData(data); // storeに格納
    };

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          console.log("ログイン検知 → ユーザーデータ取得");
          fetchParentData(session.user.id);
        } else if (event === "SIGNED_OUT") {
          console.log("ログアウト検知 → / へリダイレクト");
          clearUser(); // ユーザー情報をクリア
          router.push("/");
        }
      }
    );

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, [setParentData]);

  // fetchChildrenを実行
  useEffect(() => {
    if (parentData !== null) {
      console.log("親データ取得済み → 子データ取得実行");
      fetchChildren();
    }
  }, [parentData]);

  return <>{children}</>;
}
