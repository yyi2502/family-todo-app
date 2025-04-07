"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UpdateRewardSchema } from "@/schemas";
import { useState, useRef } from "react";
import { Pencil } from "lucide-react";
import { useRewardActions } from "@/hooks/useRewardActions";
import { useRewardStore } from "@/stores/rewardStore";

type FormData = z.infer<typeof UpdateRewardSchema>;

export default function UpdateRewardModal({ rewardId }: { rewardId: string }) {
  const { updateReward, fetchOneReward } = useRewardActions();
  const setRefetchReward = useRewardStore((state) => state.setRefetchReward);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const modalRef = useRef<HTMLDialogElement | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(UpdateRewardSchema),
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
    updateReward(rewardId, data, () => {
      setRefetchReward(true);
      modalRef.current?.close();
      reset();
    });
  };

  const handleModal = async () => {
    const data = await fetchOneReward(rewardId);
    if (data) {
      const safeData: FormData = {
        title: data.title ?? "",
        required_points: data.required_points ?? 0,
        is_active: data.is_active ?? false,
        description: data.description ?? "",
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

          <h3 className="mb-4">リワード編集</h3>
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

              {/* 説明 */}
              <label className="fieldset-label mt-4">説明（任意）</label>
              <textarea
                {...register("description")}
                className="textarea w-full"
                placeholder="リワードの詳細説明"
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
                リワード保存
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
