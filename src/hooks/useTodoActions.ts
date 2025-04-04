"use client";

import { useCallback, useState } from "react";
import { TodoType } from "@/types";
import { useTodoStore } from "@/stores/todoStore";

export function useTodoActions() {
  const { shouldRefetch, setShouldRefetch } = useTodoStore();
  // const [shouldRefetch, setShouldRefetch] = useState(false);
  // ✅ 外部からこのフラグを監視して再取得に使える
  const triggerRefetch = () => {
    console.log("shouldRefetch" + shouldRefetch);
    setShouldRefetch(!shouldRefetch); // 状態を反転させて再取得をトリガー
  };

  // export const useTodoActions = (child_id?: string) => {
  const [error, setError] = useState<string | null>(null);

  // Read--------------------------------
  // todo読み込み

  // 使い方
  // const { addTodo } = useTodoActions();
  // addTodo({ ...data, parent_id: parentData?.id || "" }, ()=>{}}
  const fetchTodos = async (
    child_id?: string,
    is_recommended?: boolean,
    status?: "pending" | "processing" | "completed"
  ) => {
    try {
      const url = new URL("/api/todo", window.location.origin);

      if (child_id) url.searchParams.append("child_id", child_id);
      if (is_recommended)
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

      // await fetchChildren(); // 最新の子リストを取得
      console.log("add");
      if (onSuccess) {
        onSuccess();
      } // 成功時の処理
    } catch (err) {
      console.error("追加エラー:", err);
    }
    triggerRefetch(); // 再取得トリガー
  };
  // []

  // UPDATE--------------------------------
  // ToDo の status 更新
  const updateTodo = async (
    todoId: string,
    newTodo: {
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
        body: JSON.stringify(newTodo), // 渡されたプロパティのみ更新
      });
      if (!res.ok) throw new Error("更新に失敗しました");

      // await fetchTodo(); // 最新の子リストを取得

      triggerRefetch(); // ✅ 追加後に再取得トリガー
      if (onSuccess) onSuccess(); // 成功時の処理
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

  // ToDo の削除
  const deleteTodo = async (
    // todos: TodoType[],
    // setTodos: (todos: TodoType[]) => void,
    todoId: string,
    onSuccess?: () => void
  ) => {
    if (!confirm("このToDoを削除しますか？")) return;
    try {
      const res = await fetch(`/api/todo/${todoId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("削除に失敗しました");

      if (onSuccess) onSuccess(); // 成功時の処理
    } catch (err) {
      console.error("削除エラー:", err);
    }
    triggerRefetch(); // ✅ 追加後に再取得トリガー
  };

  return {
    addTodo,
    fetchTodos,
    updateTodo,
    deleteTodo,
    shouldRefetch,
    triggerRefetch,
    error,
  };
}
