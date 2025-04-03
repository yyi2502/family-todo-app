"use client";

import { useCallback, useState } from "react";
import { updateTodoStatus, deleteTodo } from "@/api/todo";
import { updateTotalPoints } from "@/api/user";
import { TodoType } from "@/types";

export function useTodoActions() {
  // export const useTodoActions = (child_id?: string) => {
  const [error, setError] = useState<string | null>(null);

  // UPDATE--------------------------------
  // ToDo の status 更新
  const updateTodo = useCallback(
    async (
      todoId: string,
      updates: {
        title?: string;
        description?: string;
        points?: number;
        newStatus: "pending" | "processing" | "completed";
      },
      onSuccess?: () => void
    ) => {
      try {
        const res = await fetch(`/api/todo/${todoId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates), // 渡されたプロパティのみ更新
        });
        if (!res.ok) throw new Error("更新に失敗しました");

        // await fetchTodo(); // 最新の子リストを取得

        if (onSuccess) onSuccess(); // 成功時の処理
      } catch (err) {
        console.error("更新エラー:", err);
      }
    },
    []
  );

  //     if (newStatus === "completed" && points !== undefined) {
  //       await updateTotalPoints(child_id!, points);
  //     }
  //   } catch (err) {
  //     setError("ステータス更新に失敗しました");
  //     console.error(err);
  //   }
  // };

  // ToDo の削除
  const handleDelete = async (
    todos: TodoType[],
    setTodos: (todos: TodoType[]) => void,
    todoId: string
  ) => {
    if (!confirm("このToDoを削除しますか？")) return;
    try {
      await deleteTodo(todoId);
      setTodos(todos.filter((todo) => todo.id !== todoId));
    } catch (err) {
      setError("削除に失敗しました");
      console.error(err);
    }
  };

  return { handleUpdateStatus, handleDelete, error };
}
