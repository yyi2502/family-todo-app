"use client";
import TodoDetail from "@/components/todo/TodoDetail";
import { useParams } from "next/navigation";

export default function TodoDetailPage() {
  const { id } = useParams();

  return id ? <TodoDetail todoId={id} /> : <div>Todo ID is missing</div>;
}
