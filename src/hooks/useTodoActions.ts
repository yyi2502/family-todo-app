"use client";

import { useTodoStore } from "@/stores/todoStore";
import { TodoType } from "@/types";

export function useTodoActions() {
  const { refetchTodo, setRefetchTodo } = useTodoStore();
  // refetch用のトリガー
  const triggerRefetch = () => {
    setRefetchTodo(!refetchTodo); // 状態を反転させて再取得をトリガー
  };

  // Read--------------------------------
  // todo読み込み
  // ・全件
  // ・条件あり
  const fetchTodos = async (
    child_id?: string,
    is_recommended?: boolean,
    status?: "pending" | "processing" | "completed"
  ) => {
    try {
      const url = new URL("/api/todo", window.location.origin);

      if (child_id) url.searchParams.append("child_id", child_id);
      if (is_recommended !== undefined)
        url.searchParams.append("is_recommended", String(is_recommended));
      if (status) url.searchParams.append("status", status);

      const response = await fetch(url.toString());
      const todos = await response.json();
      if (!response.ok) throw new Error(todos.error);

      return todos;
    } catch (err) {
      console.error("ToDoの取得に失敗しました", err);
      throw new Error("ToDoの取得に失敗しました");
    }
  };

  // Read--------------------------------
  // todo1件読み込み
  const fetchOneTodo = async (
    todo_id: string
  ): Promise<TodoType | undefined> => {
    try {
      const res = await fetch(`/api/todo/${todo_id}`);
      if (!res.ok) {
        throw new Error(`todoデータ取得失敗: ${res.status}`);
      }
      const data = await res.json();
      return data;
    } catch (err) {
      console.error("todoユーザーのデータ取得エラー:", err);
      return undefined;
    }
  };

  // ADD--------------------------------
  // todo追加

  // 使い方
  // const { addTodo } = useTodoActions();
  // addTodo({ ...data, parent_id: parentData?.id || "" }, ()=>{}}
  // const addTodo = useCallback(
  const addTodo = async (
    newTodo: {
      title: string;
      created_by: string;
      points: number;
      description?: string;
      is_recommended: boolean;
    },
    onSuccess?: () => void
  ) => {
    try {
      const res = await fetch("/api/todo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTodo),
      });
      if (!res.ok) throw new Error("todo追加に失敗しました");

      console.log("add");
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error("追加エラー:", err);
    }
    triggerRefetch(); // 再取得トリガー
  };

  // UPDATE--------------------------------
  // ToDo の status 更新
  const updateTodo = async (
    todoId: string,
    newTodo: {
      title?: string;
      description?: string;
      points?: number;
      status: "pending" | "processing" | "completed";
    },
    onSuccess?: () => void
  ) => {
    console.log("update");
    try {
      const res = await fetch(`/api/todo/${todoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTodo), // 渡されたプロパティのみ更新
      });
      if (!res.ok) throw new Error("更新に失敗しました");

      triggerRefetch();
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("更新エラー:", err);
    }
  };

  //     if (newStatus === "completed" && points !== undefined) {
  //       await updateTotalPoints(child_id!, points);
  //     }
  //   } catch (err) {
  //     setError("ステータス更新に失敗しました");
  //     console.error(err);
  //   }
  // };

  // DELETE--------------------------------
  // ToDo の削除
  const deleteTodo = async (todoId: string, onSuccess?: () => void) => {
    if (!confirm("このToDoを削除しますか？")) return;
    try {
      const res = await fetch(`/api/todo/${todoId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("削除に失敗しました");

      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("削除エラー:", err);
    }
    triggerRefetch();
  };

  return {
    addTodo,
    fetchTodos,
    fetchOneTodo,
    updateTodo,
    deleteTodo,
    triggerRefetch,
    refetchTodo,
  };
}
