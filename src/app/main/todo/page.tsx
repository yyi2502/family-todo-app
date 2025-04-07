"use client";

import { useUserStore } from "@/stores/userStore";
import AddTodoModal from "@/components/todo/AddTodoModal";
import TodoList from "@/components/todo/TodoList";

export default function TodoPage() {
  const selectedUser = useUserStore((state) => state.selectedUser);
  return (
    <>
      <h2 className="text-center text-3xl mb-8">やることリスト</h2>
      {selectedUser?.role === "parent" && <AddTodoModal />}
      <div className="mt-4">
        <TodoList />
      </div>
    </>
  );
}
