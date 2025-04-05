"use client";

import Link from "next/link";
import { getStatusLabel } from "@/constants/statusOptions";
import { useUserStore } from "@/stores/userStore";
import { TodoPropsType, TodoType } from "@/types";
import { Delete, Pencil, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { NameDisplay } from "../user/NameDisplay";
import { useTodoActions } from "@/hooks/useTodoActions";
import { useTodoStore } from "@/stores/todoStore";
import UpdateTodoModal from "./UpdateTodoModal";

export default function TodoList({
  child_id,
  is_recommended,
  status,
}: TodoPropsType) {
  const selectedUser = useUserStore((state) => state.selectedUser);
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { fetchTodos, updateTodo, deleteTodo } = useTodoActions();
  const { refetchTodo, setRefetchTodo } = useTodoStore();

  // 初回ロード
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchTodos(child_id, is_recommended, status);
        setTodos(data);
      } catch (err) {
        setError("ToDoの取得に失敗しました");
      }
    };
    fetchData(); // 初回ロードで必ず取得
  }, []);

  // todoリストを取得
  useEffect(() => {
    const fetchData = async () => {
      console.log("fetchTodos");
      try {
        const data = await fetchTodos(child_id, is_recommended, status);
        setTodos(data);
      } catch (err) {
        setError("ToDoの取得に失敗しました");
      } finally {
        setRefetchTodo(false); // フェッチ完了後、フラグをリセット
      }
    };
    if (refetchTodo) {
      fetchData();
    }
  }, [refetchTodo, setRefetchTodo]);

  // status 更新
  const handleUpdateStatus = async (
    todoId: string,
    newStatus: "pending" | "processing" | "completed",
    points?: number
  ) => {
    const updatedData = {
      status: newStatus,
      child_id: newStatus === "pending" ? "" : (selectedUser?.id ?? ""),
    };
    updateTodo(todoId, updatedData);
  };
  // total_point の更新
  const updateTotalPoints = async (todoPoints: number) => {
    try {
      const response = await fetch(`/api/user/${child_id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          points: todoPoints, // 加算するポイント数
        }),
      });

      if (!response.ok) throw new Error("ポイントの更新に失敗しました");
    } catch (err) {
      setError("ポイントの更新に失敗しました");
      console.error(err);
    }
  };

  // ToDo の削除
  const handleDelete = async (e: React.MouseEvent, todoId: string) => {
    e.preventDefault();
    deleteTodo(todoId);
  };

  return (
    <div className="list bg-base-100 rounded-box shadow-md">
      {error && <p className="text-red-500">{error}</p>}
      {todos.length > 0 ? (
        <ul>
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="list-row flex justify-between items-center"
            >
              <div>
                {todo.is_recommended && (
                  <div>
                    <Star />
                  </div>
                )}
                <div>{todo.title}</div>
                <div>{todo.points}</div>
                {todo.description && (
                  <div className="text-xs uppercase font-semibold opacity-60">
                    {todo.description}
                  </div>
                )}
              </div>

              <div className="flex gap-2 items-center">
                {/* 子どもユーザー向けの表示 */}
                {selectedUser?.role === "child" ? (
                  <>
                    {todo.status === "pending" && (
                      <button
                        className="btn btn-sm bg-blue-500 text-white"
                        onClick={() =>
                          handleUpdateStatus(todo.id, "processing")
                        }
                      >
                        やる！
                      </button>
                    )}

                    {todo.status === "processing" ? (
                      selectedUser.id === todo.child_id ? (
                        <>
                          <button
                            className="btn btn-sm bg-green-500 text-white"
                            onClick={() =>
                              handleUpdateStatus(
                                todo.id,
                                "completed",
                                todo.points
                              )
                            }
                          >
                            やった！
                          </button>
                          <button
                            className="btn btn-sm bg-gray-500 text-white"
                            onClick={() =>
                              handleUpdateStatus(todo.id, "pending")
                            }
                          >
                            やめる
                          </button>
                        </>
                      ) : (
                        <span className="text-sm text-gray-500">
                          <NameDisplay id={todo.child_id} />
                          ：やっています
                        </span>
                      )
                    ) : null}

                    {todo.status === "completed" && (
                      <span className="text-sm text-gray-500">
                        <NameDisplay id={todo.child_id} />
                        ：クリア済みだよ！
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    {/* 親ユーザー向けの表示 */}
                    {todo.status !== "pending" && (
                      <span className="text-sm text-gray-500">
                        <NameDisplay id={todo.child_id} />：
                        {todo.status === "processing"
                          ? "やっています"
                          : "クリア済み"}
                      </span>
                    )}

                    {/* 編集・削除ボタン */}
                    <UpdateTodoModal todoId={todo.id} />
                    <button
                      className="btn btn-square btn-ghost"
                      onClick={(e) => handleDelete(e, todo.id)}
                    >
                      <Delete />
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">ありません</p>
      )}
    </div>
  );
}
