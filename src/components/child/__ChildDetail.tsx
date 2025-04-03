"use client";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "next/navigation";
import ChildProfile from "./ChildProfile";
import ChildTodoLists from "./ChildTodoLists";

interface ChildDetailProps {
  childId: string;
}

export default function ChildDetail({ childId }: ChildDetailProps) {
  const { childList } = useUserStore();
  const child = childList.find((c) => c.id === childId);

  if (!child) return <p>子ユーザーが見つかりません</p>;

  return (
    <div className="p-4">
      <ChildProfile child={child} />
      <ChildTodoLists childId={childId} />
    </div>
  );
}
