"use client";

import { useEffect } from "react";
import { useUserStore } from "@/stores/userStore";

const useFetchParentData = () => {
  const { parentData, fetchChildrenData } = useUserStore();

  // parentDataが更新された場合に再度fetchを行う
  useEffect(() => {
    if (parentData?.id) {
      console.log("親データが更新されたので、再フェッチします");
      fetchChildrenData(); // 必要であれば、子データも再取得
    }
  }, [parentData, fetchChildrenData]); // parentDataが更新されるたびに実行

  return null; // 何も返さないが、副作用を管理
};

export default useFetchParentData;
