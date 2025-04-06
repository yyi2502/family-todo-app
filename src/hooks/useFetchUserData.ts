"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/stores/userStore";
import { createClient } from "@/utils/supabase/client";

const useFetchUserData = () => {
  const { fetchParentData, fetchChildrenData } = useUserStore();
  const [loading, setLoading] = useState(true); // データ取得中の状態を管理

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const supabase = createClient();
        const { data: userData, error: userError } =
          await supabase.auth.getUser();

        if (userError) {
          console.error("ユーザー情報の取得に失敗:", userError);
          return;
        }

        if (userData?.user) {
          fetchParentData(userData.user.id);
          console.log("親データ取得完了 → 子供データ取得開始");
          fetchChildrenData();
          setLoading(false); // データ取得が完了したらloadingをfalseに
        }
      } catch (error) {
        console.error("データ取得エラー:", error);
      }
    };

    fetchUserData();
  }, [fetchChildrenData, fetchParentData]);

  return { loading }; // loading状態を返す
};

export default useFetchUserData;
