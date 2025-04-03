"use client";

import { useFetchUserData } from "@/hooks/useFetchUserData";

/**
 * 親ユーザー情報を取得し、storeへ保存
 */
export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useFetchUserData();

  return <>{children}</>;
}
