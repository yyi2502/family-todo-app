"use client";

import { useUserStore } from "@/stores/userStore";
import AddTodoModal from "@/components/todo/AddTodoModal";
import TodoList from "@/components/todo/TodoList";

export default function TodoPage() {
  const selectedUser = useUserStore((state) => state.selectedUser);
  return (
    <>
      {selectedUser?.role === "parent" && <AddTodoModal />}
      <TodoList />
    </>
  );
}
