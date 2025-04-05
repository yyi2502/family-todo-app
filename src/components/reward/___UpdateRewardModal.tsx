"use client";

import { useRef, useState } from "react";
import { useUserStore } from "@/stores/userStore";
import { useForm } from "react-hook-form";
import { useChildActions } from "@/hooks/useChildActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UpdateRewardSchema } from "@/schemas";
import { Pencil, Plus } from "lucide-react";
import { RewardType } from "@/types";
import { useRewardActions } from "@/hooks/useRewardActions";

type FormData = z.infer<typeof UpdateRewardSchema>;

export default function UpdateRewardModal({ reward }: { reward: RewardType }) {
  const { updateReward } = useRewardActions();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [newTitle, setNewTitle] = useState<string>(reward.title);
  const [newDescription, setNewDescription] = useState<string>(
    reward.description || ""
  );
  const [newRequiredPoints, setNewRequiredPoints] = useState<number>(
    reward.required_points
  );

  const modalRef = useRef<HTMLDialogElement | null>(null); // useRefでモーダル要素を取得

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(UpdateRewardSchema),
  });

  const onSubmit = async (data: FormData) => {
    setError("");
    setMessage("");

    updateReward(
      {
        id: reward.id,
        ...data,
        title: newTitle,
        description: newDescription,
        required_points: newRequiredPoints,
      },
      () => {
        modalRef.current?.close();
        reset();
      }
    );
  };

  const handleModal = () => {
    modalRef.current?.showModal();
  };

  return (
    <>
      <button className="btn" onClick={handleModal}>
        編集
        <Pencil width={20} height={20} />
      </button>
      <dialog ref={modalRef} className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="mb-4">リワード編集</h3>
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

              <label className="fieldset-label">詳細</label>
              <input
                type="text"
                {...register("description")}
                className="input w-full"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
              />
              {errors.description && (
                <p className="text-red-500 text-sm">
                  {errors.description.message}
                </p>
              )}

              <label className="fieldset-label">ポイント</label>
              <input
                type="number"
                {...register("required_points", { valueAsNumber: true })}
                className="input w-full"
                value={newRequiredPoints}
                onChange={(e) => setNewRequiredPoints(Number(e.target.value))}
              />
              {errors.required_points && (
                <p className="text-red-500 text-sm">
                  {errors.required_points.message}
                </p>
              )}

              <div>
                <button type="submit" className="btn btn-neutral mt-4 w-full">
                  保存
                </button>
                <button
                  onClick={() => {
                    modalRef.current?.close();
                    reset();
                    setNewTitle(reward?.title || "");
                    setNewDescription(reward?.description || "");
                    setNewRequiredPoints(reward?.required_points || 0);
                  }}
                  className="btn btn-neutral mt-4 w-full"
                >
                  キャンセル
                </button>
              </div>
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
