"use client";

import { useRef, useState } from "react";
import { useUserStore } from "@/stores/userStore";
import { useForm } from "react-hook-form";
import { useChildActions } from "@/hooks/useChildActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { UpdateChildSchema } from "@/schemas";
import { Pencil } from "lucide-react";
import { UserType } from "@/types";

type FormData = z.infer<typeof UpdateChildSchema>;

export default function UpdateChildModal({ childId }: { childId: string }) {
  const { updateChild } = useChildActions();
  const childList = useUserStore((state) => state.childList);
  const child: UserType | undefined = childList.find((c) => c.id === childId);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [newName, setNewName] = useState<string>(child?.name || "");
  const [newTotalPoints, setNewTotalPoints] = useState<number>(
    child?.total_points || 0
  );
  const modalRef = useRef<HTMLDialogElement | null>(null); // useRefでモーダル要素を取得

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(UpdateChildSchema),
  });

  const onSubmit = async (data: FormData) => {
    setError("");
    setMessage("");

    updateChild(
      childId,
      { ...data, name: newName, total_points: newTotalPoints },
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
          <h3 className="mb-4">子ユーザー情報 編集</h3>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-base-200 border border-base-300 p-4 rounded-box"
          >
            <fieldset className="fieldset">
              <label className="fieldset-label">お名前</label>
              <input
                type="text"
                {...register("name")}
                className="input w-full"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}

              <label className="fieldset-label">ポイント</label>
              <input
                type="number"
                {...register("points", { valueAsNumber: true })}
                className="input w-full"
                value={newTotalPoints}
                onChange={(e) => setNewTotalPoints(Number(e.target.value))}
              />
              {errors.points && (
                <p className="text-red-500 text-sm">{errors.points.message}</p>
              )}
              <div>
                <button type="submit" className="btn btn-neutral mt-4 w-full">
                  保存
                </button>
                <button
                  onClick={() => {
                    modalRef.current?.close();
                    reset();
                    setNewName(child?.name || "");
                    setNewTotalPoints(child?.total_points || 0);
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
