"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AddTodoSchema, UpdateTodoSchema } from "@/schemas";
import { useState, useTransition, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/userStore";
import { Pencil, Plus } from "lucide-react";
import { useTodoActions } from "@/hooks/useTodoActions";
import { useTodoStore } from "@/stores/todoStore";

type FormData = z.infer<typeof UpdateTodoSchema>;

export default function UpdateTodoModal({ todoId }: { todoId: string }) {
  const { updateTodo } = useTodoActions();
  const parentData = useUserStore((state) => state.parentData);
  const setRefetchTodo = useTodoStore((state) => state.setRefetchTodo);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [newTitle, setNewTitle] = useState<string>("");
  const [newPoints, setNewPoints] = useState<number>(0);
  const [newDescription, setNewDescription] = useState<string>("");
  const [newIsrecommended, setNewIsrecommended] = useState<boolean>();

  const { fetchOneTodo } = useTodoActions();
  const modalRef = useRef<HTMLDialogElement | null>(null); // useRefでモーダル要素を取得

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(UpdateTodoSchema),
    defaultValues: {
      points: 10,
      is_recommended: false,
      description: "",
      status: "pending",
      child_id: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    console.log("onclick");
    setError("");
    setMessage("");
    updateTodo(todoId, data, () => {
      modalRef.current?.close();
      reset();
      setRefetchTodo(true);
    });
  };

  const handleModal = async () => {
    const data = await fetchOneTodo(todoId);
    if (data) {
      setNewTitle(data.title);
      setNewPoints(data.points);
      setNewDescription(data.description ?? "");
      setNewIsrecommended(data.is_recommended);
      console.log("reset");
      // reset(data);
    }
    modalRef.current?.showModal();
  };

  return (
    <>
      <button className="btn btn-square btn-ghost" onClick={handleModal}>
        <Pencil width={20} height={20} />
      </button>
      <dialog ref={modalRef} className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="mb-4">Todo編集</h3>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-base-200 border border-base-300 p-4 rounded-box"
          >
            <fieldset className="fieldset flex flex-col">
              <label className="fieldset-label">タイトル</label>
              <input
                type="text"
                {...register("title")}
                className="input w-full"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title.message}</p>
              )}

              <label className="fieldset-label mt-4">ポイント</label>
              <input
                type="number"
                {...register("points", { valueAsNumber: true })}
                className="input w-full"
                value={newPoints}
                onChange={(e) => setNewPoints(Number(e.target.value))}
              />
              {errors.points && (
                <p className="text-red-500 text-sm">{errors.points.message}</p>
              )}

              {/* ステータス選択セレクトボックス */}
              {/* <label className="fieldset-label">ステータス</label>
              <select {...register("status")} className="select w-full">
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.status && (
                <p className="text-red-500 text-sm">{errors.status.message}</p>
              )} */}

              {/* 説明文入力 */}
              <label className="fieldset-label mt-4">説明（任意）</label>
              <textarea
                {...register("description")}
                className="textarea w-full"
                placeholder="ToDo の詳細な説明"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />
              {errors.description && (
                <p className="text-red-500 text-sm">
                  {errors.description.message}
                </p>
              )}

              {/* おすすめ表示チェックボックス */}

              <label className="fieldset-label mt-4">
                <input
                  type="checkbox"
                  {...register("is_recommended")}
                  className="checkbox bg-white"
                  checked={newIsrecommended}
                  onChange={(e) => setNewIsrecommended(e.target.checked)}
                />
                おすすめに表示する
              </label>

              {/* 子ども選択セレクトボックス */}
              {/* <label className="fieldset-label">どの子どもが対応するか</label>
              <select {...register("child_id")} className="select w-full">
                <option value="">選択してください</option>
                {childList.map((child) => (
                  <option key={child.id} value={child.id}>
                    {child.name}
                  </option>
                ))}
              </select>
              {errors.child_id && (
                <p className="text-red-500 text-sm">
                  {errors.child_id.message}
                </p>
              )} */}

              <button type="submit" className="btn btn-neutral mt-4 w-full">
                保存
              </button>
            </fieldset>
          </form>

          {error && <p className="text-red-500">{error}</p>}
          {message && <p className="text-green-500">{message}</p>}
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
