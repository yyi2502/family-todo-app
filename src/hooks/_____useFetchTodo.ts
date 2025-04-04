"use client";

import { TodoParamsType } from "@/types";
import { useState, useEffect, useCallback } from "react";

/**
 * todo情報を取得するカスタムフック
 */
export function useFetchTodo({
  childId,
  isRecommended,
  status,
}: TodoParamsType) {
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = useCallback(async () => {
    try {
      setError(null);

      const params = new URLSearchParams();
      if (childId) params.append("child_id", childId);
      if (isRecommended) params.append("is_recommended", String(isRecommended));
      if (status && status.length > 0) {
        status.forEach((s) => params.append("status", s));
      }

      const res = await fetch(`/api/todos?${params.toString()}`);
      if (!res.ok) {
        throw new Error(`todoデータ取得失敗: ${res.status}`);
      }

      const data = await res.json();
      console.log(todos);
      setTodos(data.todos);
    } catch (err) {
      console.error("todo取得エラー:", err);
      setError((err as Error).message);
    }
  }, [childId, isRecommended, status]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  return { todos, error, refetch: fetchTodos };
}
