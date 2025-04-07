"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AddTodoSchema } from "@/schemas";
import { useState, useRef } from "react";
import { useUserStore } from "@/stores/userStore";
import { Plus } from "lucide-react";
import { useTodoActions } from "@/hooks/useTodoActions";
import { useTodoStore } from "@/stores/todoStore";

type FormData = z.infer<typeof AddTodoSchema>;

export default function AddTodoModal() {
  const { addTodo } = useTodoActions();
  const parentData = useUserStore((state) => state.parentData);
  const setRefetchTodo = useTodoStore((state) => state.setRefetchTodo);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const modalRef = useRef<HTMLDialogElement | null>(null); // useRefでモーダル要素を取得

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(AddTodoSchema),
    defaultValues: {
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
    addTodo({ ...data, created_by: parentData?.id || "" }, () => {
      modalRef.current?.close();
      reset();
      setRefetchTodo(true);
    });
  };

  const handleModal = () => {
    modalRef.current?.showModal();
  };

  return (
    <>
      <button className="btn btn-info" onClick={handleModal}>
        やること追加
        <Plus width={20} height={20} />
      </button>
      <dialog ref={modalRef} className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="mb-4">やること追加</h3>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-base-200 border border-base-300 p-4 rounded-box"
          >
            <fieldset className="fieldset">
              <label className="fieldset-label">タイトル</label>
              <input
                type="text"
                {...register("title")}
                className="input w-full"
                placeholder="お風呂掃除"
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title.message}</p>
              )}

              <label className="fieldset-label mt-4">ポイント</label>
              <input
                type="number"
                {...register("points", { valueAsNumber: true })}
                className="input w-full"
              />
              {errors.points && (
                <p className="text-red-500 text-sm">{errors.points.message}</p>
              )}

              {/* 説明文入力 */}
              <label className="fieldset-label mt-4">説明（任意）</label>
              <textarea
                {...register("description")}
                className="textarea w-full"
                placeholder="やることの説明（任意）"
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
                />
                おすすめに表示する
              </label>

              <button type="submit" className="btn btn-info mt-4 w-full">
                やること追加
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
