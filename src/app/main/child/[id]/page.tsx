"use client";
import { useUserStore } from "@/stores/userStore";
import { useParams } from "next/navigation";
import ChildInfo from "@/components/child/ChildInfo";
import TodoList from "@/components/todo/TodoList";

export default function ChildDetailPage() {
  const { id } = useParams();
  const { childList } = useUserStore();
  const child = childList.find((c) => c.id === id);
  return child ? (
    <>
      <ChildInfo childId={child.id} />

      <h3 className="text-lg font-semibold mt-6">やること！</h3>
      <TodoList child_id={child.id} status={"processing"} />

      <h3 className="text-lg font-semibold mt-6">おすすめ</h3>
      <TodoList is_recommended={true} />

      <h3 className="text-lg font-semibold mt-6">クリア</h3>
      <TodoList child_id={child.id} status={"completed"} />
    </>
  ) : (
    <div>ユーザーが見つかりません</div>
  );
}
