"use client";

import { useRef, useState } from "react";
import { useUserStore } from "@/stores/userStore";
import { useForm } from "react-hook-form";
import { useChildActions } from "@/hooks/useChildActions";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AddChildSchema } from "@/schemas";
import { Plus } from "lucide-react";

type FormData = z.infer<typeof AddChildSchema>;

export default function AddChildModal() {
  const { addChild } = useChildActions();
  const parentData = useUserStore((state) => state.parentData);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const modalRef = useRef<HTMLDialogElement | null>(null); // useRefでモーダル要素を取得
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(AddChildSchema),
  });

  const onSubmit = async (data: FormData) => {
    setError("");
    setMessage("");
    addChild({ ...data, parent_id: parentData?.id || "" }, () => {
      modalRef.current?.close();
      reset();
    });
  };

  const handleModal = () => {
    modalRef.current?.showModal();
  };

  return (
    <>
      <button className="btn" onClick={handleModal}>
        子どもユーザー追加
        <Plus width={20} height={20} />
      </button>
      <dialog ref={modalRef} className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="mb-4">子どもユーザー追加</h3>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-base-200 border border-base-300 p-4 rounded-box"
          >
            <fieldset className="fieldset">
              <label className="fieldset-label">追加するお子さまのお名前</label>
              <input
                type="text"
                {...register("name")}
                className="input w-full"
                placeholder="お名前"
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}

              <button type="submit" className="btn btn-neutral mt-4 w-full">
                追加
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
