"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/stores/userStore";
import { useTodoActions } from "@/hooks/useTodoActions";
import { useTodoStore } from "@/stores/todoStore";
import { useChildActions } from "@/hooks/useChildActions";
import UpdateTodoModal from "./UpdateTodoModal";
import { TodoPropsType, TodoType } from "@/types";
import { Delete, Star } from "lucide-react";
import { NameDisplay } from "../user/NameDisplay";
import { runConfetti } from "@/utils/confetti/confetti";

export default function TodoList({
  child_id,
  is_recommended,
  status,
}: TodoPropsType) {
  const selectedUser = useUserStore((state) => state.selectedUser);
  const { refetchTodo, setRefetchTodo } = useTodoStore();
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { fetchTodos, updateTodo, deleteTodo } = useTodoActions();
  const { updateChild } = useChildActions();

  // 初回ロード
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchTodos(child_id, is_recommended, status);
        setTodos(data);
      } catch (err) {
        console.error(err);
        setError("ToDoの取得に失敗しました");
      }
    };
    fetchData(); // 初回ロードで必ず取得
  }, [status, is_recommended, fetchTodos, child_id]);

  // todoリストを取得
  useEffect(() => {
    const fetchData = async () => {
      console.log("fetchTodos");
      try {
        const data = await fetchTodos(child_id, is_recommended, status);
        setTodos(data);
      } catch (err) {
        console.error(err);
        setError("ToDoの取得に失敗しました");
      } finally {
        setRefetchTodo(false); // フェッチ完了後、フラグをリセット
      }
    };
    if (refetchTodo) {
      fetchData();
    }
  }, [
    refetchTodo,
    setRefetchTodo,
    status,
    is_recommended,
    fetchTodos,
    child_id,
  ]);

  // status 更新
  const handleUpdateStatus = async (
    todoId: string,
    newStatus: "pending" | "processing" | "completed",
    points?: number
  ) => {
    if (selectedUser) {
      const updatedData = {
        status: newStatus,
        child_id: newStatus === "pending" ? "" : selectedUser.id,
      };
      updateTodo(todoId, updatedData);

      //ポイント更新
      if (newStatus === "completed" && points) {
        const newTotalPoints = selectedUser.total_points + points;
        updateChild(selectedUser.id, { total_points: newTotalPoints });
      }
    }
  };

  // ToDo の削除
  const handleDelete = async (e: React.MouseEvent, todoId: string) => {
    e.preventDefault();
    deleteTodo(todoId);
  };

  // ステータスとおすすめフラグに応じてカードのスタイルを決定
  const getCardClass = (todo: TodoType): string => {
    // 完了済み：グレー
    if (todo.status === "completed") {
      return "card shadow-sm bg-base-300 text-base-300-content";
    }

    // おすすめ＆未着手：黄色
    if (todo.status === "pending" && todo.is_recommended) {
      return "card shadow-sm bg-warning";
    }

    // 選択ユーザー＆進行中：青緑
    // 親ユーザー＆進行中：青緑
    if (
      todo.status === "processing" &&
      (selectedUser?.id === todo.child_id || selectedUser?.role === "parent")
    ) {
      return "card shadow-sm bg-accent	 text-accent-content";
    }

    // デフォルト
    return "card shadow-sm bg-base-100 text-base-100-content";
  };

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {todos.map((todo) => (
        <li key={todo.id}>
          <div className={getCardClass(todo)}>
            <div className="card-body">
              <h2 className="card-title flex items-center gap-2">
                {todo.is_recommended && <Star width={15} height={15} />}
                {todo.title}
              </h2>

              <p className="text-sm">{todo.points}ポイント</p>

              {todo.description && (
                <p className="text-xs uppercase opacity-60">
                  {todo.description}
                </p>
              )}

              {/* 子どもユーザー向けの表示 */}
              {selectedUser?.role === "child" ? (
                <div className="justify-end card-actions flex flex-wrap gap-2 items-center mt-2">
                  {todo.status === "pending" && (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleUpdateStatus(todo.id, "processing")}
                    >
                      やる！
                    </button>
                  )}

                  {todo.status === "processing" ? (
                    selectedUser.id === todo.child_id ? (
                      <>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => {
                            handleUpdateStatus(
                              todo.id,
                              "completed",
                              todo.points
                            );
                            runConfetti();
                          }}
                        >
                          やった！
                        </button>
                        <button
                          className="btn btn-soft btn-sm"
                          onClick={() => handleUpdateStatus(todo.id, "pending")}
                        >
                          やめる
                        </button>
                      </>
                    ) : (
                      <span className="text-xs underline text-gray-500">
                        <NameDisplay id={todo.child_id} />
                        がやってるよ
                      </span>
                    )
                  ) : null}

                  {todo.status === "completed" && (
                    <span className="text-xs underline text-gray-500">
                      <NameDisplay id={todo.child_id} />
                      がクリア！
                    </span>
                  )}
                </div>
              ) : (
                <div className="card-actions mt-2 flex justify-end">
                  {/* 親ユーザー向けの表示 */}
                  {todo.status !== "pending" && (
                    <p className="text-xs w-full underline text-gray-500 text-right">
                      <NameDisplay id={todo.child_id} />が
                      {todo.status === "processing" ? "やってるよ" : "クリア！"}
                    </p>
                  )}

                  {/* 編集・削除ボタン */}
                  <div className="">
                    <UpdateTodoModal todoId={todo.id} />
                    <button
                      className="btn btn-square btn-ghost"
                      onClick={(e) => handleDelete(e, todo.id)}
                    >
                      <Delete />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
