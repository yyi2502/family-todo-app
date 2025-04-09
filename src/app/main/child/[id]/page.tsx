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
      <section className="max-w-3xl mx-auto p-5 mb-8">
        <ChildInfo childId={child.id} />
      </section>

      <section className="max-w-3xl mx-auto p-6 mb-10">
        <h2 className="text-center text-3xl mb-5">やること！</h2>
        <TodoList child_id={child.id} status={"processing"} />
      </section>

      <div className="bg-amber-100">
        <section className="max-w-3xl mx-auto p-6 mb-10">
          <h2 className="text-center text-3xl mb-8">おすすめ</h2>
          <TodoList is_recommended={true} />
        </section>
      </div>

      <section className="max-w-3xl mx-auto p-6 mb-10">
        <h2 className="text-center text-3xl mb-8">クリア</h2>
        <TodoList child_id={child.id} status={"completed"} />
      </section>
    </>
  ) : (
    <div>ユーザーが見つかりません</div>
  );
}
