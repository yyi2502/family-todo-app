"use client";

import { getStatusLabel } from "@/constants/statusOptions";
import { useUserStore } from "@/stores/userStore";
import { TodoType } from "@/types";
import { Delete, Pencil } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { NameDisplay } from "../user/NameDisplay";
import { useTodoActions } from "@/hooks/useTodoActions";
import { useTodoStore } from "@/stores/todoStore";

export default function TodoList({
  child_id,
  is_recommended,
  status,
}: TodoType) {
  const selectedUser = useUserStore((state) => state.selectedUser);
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [error, setError] = useState<string | null>(null);

  // const { fetchTodos, shouldRefetch, deleteTodo } = useTodoActions();
  const { fetchTodos, deleteTodo } = useTodoActions();
  const { shouldRefetch, setShouldRefetch } = useTodoStore();

  // 特定のtodoリストを取得
  useEffect(() => {
    console.log("ふぇっちtodo");
    try {
      fetchTodos()
        .then((data) => {
          setTodos(data);
          setShouldRefetch(false); // フェッチ完了後、フラグをリセット
        })
        .catch(() => {
          setError("ToDoの取得に失敗しました");
          setShouldRefetch(false);
        });
    } catch {
      setError("ToDoの取得に失敗しました");
    }
  }, [shouldRefetch, setShouldRefetch]);
  console.log("todolist");

  // ToDo の status 更新
  const handleUpdateStatus = async (
    todoId: string,
    newStatus: "pending" | "processing" | "completed",
    points?: number
  ) => {
    try {
      const response = await fetch(`/api/todo/${todoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, child_id }),
      });

      if (!response.ok) throw new Error("ステータス更新に失敗しました");

      // setTodos((prevTodos) =>
      //   prevTodos.map((todo) =>
      //     todo.id === todoId ? { ...todo, status: newStatus } : todo
      //   )
      // );

      // ToDo が完了した場合、total_point を更新
      if (newStatus === "completed" && points !== undefined) {
        await updateTotalPoints(points);
      }
    } catch (err) {
      setError("ステータス更新に失敗しました~");
      console.error(err);
    }
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

      // userStore の childList も更新
      // useUserStore.setState((state) => ({
      //   childList: state.childList.map((child) =>
      //     child.id === child_id
      //       ? { ...child, total_point: child.total_points + todoPoints } // 修正
      //       : child
      //   ),
      // }));
    } catch (err) {
      setError("ポイントの更新に失敗しました");
      console.error(err);
    }
  };

  // ToDo の削除
  const handleDelete = async (e: React.MouseEvent, todoId: string) => {
    e.preventDefault();
    alert(todoId);
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
                <div>{todo.title}</div>
                <div>{todo.points}</div>
                <div className="text-xs uppercase font-semibold opacity-60">
                  <NameDisplay id={todo.child_id} /> -{" "}
                  {getStatusLabel(todo.status)}
                </div>
                {todo.description && <div>{todo.description}</div>}
              </div>
              <div className="flex gap-2">
                {selectedUser?.role === "child" ? (
                  <>
                    {/* ステータス変更ボタン */}
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
                    {todo.status === "processing" && (
                      <button
                        className="btn btn-sm bg-green-500 text-white"
                        onClick={() =>
                          handleUpdateStatus(todo.id, "completed", todo.points)
                        }
                      >
                        やった！
                      </button>
                    )}
                    {/* <button
                      className="btn btn-sm bg-blue-500 text-white"
                      disabled={todo.status === "processing"}
                      onClick={() => handleUpdateStatus(todo.id, "processing")}
                    >
                      やる！
                    </button>
                    <button
                      className="btn btn-sm bg-green-500 text-white"
                      disabled={todo.status === "completed"}
                      onClick={() =>
                        handleUpdateStatus(todo.id, "completed", todo.points)
                      }
                    >
                      やった！
                    </button> */}
                    <button
                      className="btn btn-sm bg-gray-500 text-white"
                      disabled={todo.status === "pending"}
                      onClick={() => handleUpdateStatus(todo.id, "pending")}
                    >
                      やめる
                    </button>
                  </>
                ) : (
                  <>
                    {/* 編集 & 削除ボタン */}
                    <Link href={`/main/todo/${todo.id}`}>
                      <button className="btn btn-square btn-ghost">
                        <Pencil />
                      </button>
                    </Link>
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
