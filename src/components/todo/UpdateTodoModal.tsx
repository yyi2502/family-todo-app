"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UpdateTodoSchema } from "@/schemas";
import { useState, useRef } from "react";
import { Pencil } from "lucide-react";
import { useTodoActions } from "@/hooks/useTodoActions";
import { useTodoStore } from "@/stores/todoStore";

type FormData = z.infer<typeof UpdateTodoSchema>;

export default function UpdateTodoModal({ todoId }: { todoId: string }) {
  const { updateTodo, fetchOneTodo } = useTodoActions();
  const setRefetchTodo = useTodoStore((state) => state.setRefetchTodo);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const modalRef = useRef<HTMLDialogElement | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(UpdateTodoSchema),
    defaultValues: {
      title: "",
      points: 10,
      is_recommended: false,
      description: "",
      status: "pending",
      child_id: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setError("");
    setMessage("");
    updateTodo(todoId, data, () => {
      setRefetchTodo(true);
      modalRef.current?.close();
      reset();
    });
  };

  const handleModal = async () => {
    const data = await fetchOneTodo(todoId);
    if (data) {
      const safeData: FormData = {
        title: data.title ?? "",
        points: data.points ?? 0,
        is_recommended: data.is_recommended ?? false,
        description: data.description ?? "",
        status: data.status ?? "pending",
        child_id: data.child_id ?? "",
      };

      reset(safeData); // フォームに初期値を反映
    }
    modalRef.current?.showModal();
  };

  return (
    <>
      <button className="btn btn-square btn-ghost" onClick={handleModal}>
        <Pencil width={20} height={20} />
      </button>

      <dialog ref={modalRef} className="modal">
        <div className="modal-box relative">
          <button
            onClick={() => modalRef.current?.close()}
            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          >
            ✕
          </button>

          <h3 className="mb-4">Todo編集</h3>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(onSubmit)(e);
            }}
            className="bg-base-200 border border-base-300 p-4 rounded-box"
          >
            <fieldset className="fieldset flex flex-col">
              {/* タイトル */}
              <label className="fieldset-label">タイトル</label>
              <input
                type="text"
                {...register("title")}
                className="input w-full"
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title.message}</p>
              )}

              {/* ポイント */}
              <label className="fieldset-label mt-4">ポイント</label>
              <input
                type="number"
                {...register("points", { valueAsNumber: true })}
                className="input w-full"
              />
              {errors.points && (
                <p className="text-red-500 text-sm">{errors.points.message}</p>
              )}

              {/* 説明 */}
              <label className="fieldset-label mt-4">説明（任意）</label>
              <textarea
                {...register("description")}
                className="textarea w-full"
                placeholder="ToDo の詳細な説明"
              />
              {errors.description && (
                <p className="text-red-500 text-sm">
                  {errors.description.message}
                </p>
              )}

              {/* おすすめチェックボックス */}
              <label className="fieldset-label mt-4">
                <input
                  type="checkbox"
                  {...register("is_recommended")}
                  className="checkbox bg-white"
                />
                おすすめに表示する
              </label>

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
