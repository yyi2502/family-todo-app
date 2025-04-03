"use client";
import { useUserStore } from "@/stores/userStore";

export default function SettingPage() {
  const parentData = useUserStore((state) => state.parentData);

  return <>setting{parentData ? parentData.name : "Guest"}</>;
}
