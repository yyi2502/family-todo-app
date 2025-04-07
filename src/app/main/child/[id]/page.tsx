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

      <h2 className="text-center text-3xl mt-15 mb-8">やること！</h2>
      <TodoList child_id={child.id} status={"processing"} />

      <h2 className="text-center text-3xl mt-15 mb-8">おすすめ</h2>
      <TodoList is_recommended={true} />

      <h2 className="text-center text-3xl mt-15 mb-8">クリア</h2>
      <TodoList child_id={child.id} status={"completed"} />
    </>
  ) : (
    <div>ユーザーが見つかりません</div>
  );
}
