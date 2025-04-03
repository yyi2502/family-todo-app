"use client";

import { getStatusLabel } from "@/constants/statusOptions";
import { useUserStore } from "@/stores/userStore";
import { TodoParamsType, TodoType } from "@/types";
import { Delete, Pencil } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { NameDisplay } from "../user/NameDisplay";
import { fetchAllTodos } from "@/utils/todo/todoApi";

export default function TodoList({
  childId,
  isRecommended,
  status,
}: TodoParamsType) {
  const selectedUser = useUserStore((state) => state.selectedUser);
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 特定のtodoリストを取得
  // useEffect(() => {
  //   fetchTodos();
  // }, [child_id, is_recommended, status]);

  // const fetchTodos = async () => {
  //   try {
  //     const data = await fetchAllTodos(child_id, is_recommended, status);
  //     setTodos(data);
  //   } catch {
  //     setError("ToDoの取得に失敗しました");
  //   }
  // };

  // // ToDo の status 更新
  // const handleUpdateStatus = async (
  //   todoId: string,
  //   newStatus: "pending" | "processing" | "completed",
  //   points?: number
  // ) => {
  //   try {
  //     const response = await fetch(`/api/todo/${todoId}`, {
  //       method: "PUT",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ status: newStatus, child_id }),
  //     });

  //     if (!response.ok) throw new Error("ステータス更新に失敗しました");

  //     setTodos((prevTodos) =>
  //       prevTodos.map((todo) =>
  //         todo.id === todoId ? { ...todo, status: newStatus } : todo
  //       )
  //     );

  //     // ToDo が完了した場合、total_point を更新
  //     if (newStatus === "completed" && points !== undefined) {
  //       await updateTotalPoints(points);
  //     }
  //   } catch (err) {
  //     setError("ステータス更新に失敗しました~");
  //     console.error(err);
  //   }
  // };
  // // total_point の更新
  // const updateTotalPoints = async (todoPoints: number) => {
  //   console.log("-----updateTotalPoints");
  //   console.log(todoPoints);
  //   try {
  //     console.log(child_id);
  //     const response = await fetch(`/api/user/${child_id}`, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         points: todoPoints, // 加算するポイント数
  //       }),
  //     });

  //     if (!response.ok) throw new Error("ポイントの更新に失敗しました");

  //     // userStore の childList も更新
  //     // useUserStore.setState((state) => ({
  //     //   childList: state.childList.map((child) =>
  //     //     child.id === child_id
  //     //       ? { ...child, total_point: child.total_points + todoPoints } // 修正
  //     //       : child
  //     //   ),
  //     // }));
  //   } catch (err) {
  //     setError("ポイントの更新に失敗しました");
  //     console.error(err);
  //   }
  // };

  // // ToDo の削除
  // const handleDelete = async (todoId: string) => {
  //   if (!confirm("このToDoを削除しますか？")) return;
  //   try {
  //     const response = await fetch(`/api/todo/${todoId}`, { method: "DELETE" });

  //     if (!response.ok) throw new Error("削除に失敗しました");

  //     setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== todoId));
  //   } catch (err) {
  //     setError("削除に失敗しました");
  //     console.error(err);
  //   }
  // };

  // console.log("child_idchild_id" + child_id);
  // console.log(selectedUser?.id);

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
                        // onClick={() =>
                        // handleUpdateStatus(todo.id, "processing")
                        // }
                      >
                        やる！
                      </button>
                    )}
                    {todo.status === "processing" && (
                      <button
                        className="btn btn-sm bg-green-500 text-white"
                        // onClick={() =>
                        // handleUpdateStatus(todo.id, "completed", todo.points)
                        // }
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
                      // onClick={() => handleUpdateStatus(todo.id, "pending")}
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
                      // onClick={() => handleDelete(todo.id)}
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
