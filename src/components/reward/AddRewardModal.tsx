"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AddRewardSchema } from "@/schemas";
import { useState, useRef } from "react";
import { useUserStore } from "@/stores/userStore";
import { Plus } from "lucide-react";
import { useRewardActions } from "@/hooks/useRewardActions";
import { useRewardStore } from "@/stores/rewardStore";

type FormData = z.infer<typeof AddRewardSchema>;

export default function AddRewardModal() {
  const { addReward } = useRewardActions();
  const parentData = useUserStore((state) => state.parentData);
  const setRefetchReward = useRewardStore((state) => state.setRefetchReward);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const modalRef = useRef<HTMLDialogElement | null>(null); // useRefでモーダル要素を取得

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(AddRewardSchema),
    defaultValues: {
      title: "",
      required_points: 100,
      is_active: false,
      description: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setError("");
    setMessage("");
    addReward(
      {
        ...data,
        is_active: data.is_active ?? false,
        created_by: parentData?.id || "",
      },
      () => {
        modalRef.current?.close();
        reset();
        setRefetchReward(true);
      }
    );
  };

  const handleModal = () => {
    modalRef.current?.showModal();
  };

  return (
    <>
      <button className="btn btn-info" onClick={handleModal}>
        リワード追加
        <Plus width={20} height={20} />
      </button>
      <dialog ref={modalRef} className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="mb-4">リワード追加</h3>
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
                placeholder="ゲーム1時間"
              />
              {errors.title && (
                <p className="text-red-500 text-sm">{errors.title.message}</p>
              )}

              <label className="fieldset-label mt-4">必要ポイント</label>
              <input
                type="number"
                {...register("required_points", { valueAsNumber: true })}
                className="input w-full"
              />
              {errors.required_points && (
                <p className="text-red-500 text-sm">
                  {errors.required_points.message}
                </p>
              )}

              {/* 説明文入力 */}
              <label className="fieldset-label mt-4">説明（任意）</label>
              <textarea
                {...register("description")}
                className="textarea w-full"
                placeholder="リワードの説明"
              />
              {errors.description && (
                <p className="text-red-500 text-sm">
                  {errors.description.message}
                </p>
              )}

              {/* 繰り返しチェックボックス */}
              {/* <label className="fieldset-label mt-4">
                <input
                  type="checkbox"
                  {...register("is_active")}
                  className="checkbox bg-white"
                />
                繰り返す（景品交換後も同じ景品が追加されます）
              </label> */}

              <button type="submit" className="btn btn-info mt-4 w-full">
                リワード追加
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
