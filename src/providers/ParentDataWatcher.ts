"use client";

import useFetchParentData from "@/hooks/useFetchParentData";

export default function ParentDataWatcher() {
  // 親データの変更を監視するカスタムフックを使用
  useFetchParentData();

  return null;
}
