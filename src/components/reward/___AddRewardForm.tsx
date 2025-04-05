"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AddRewardSchema } from "@/schemas";
import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/userStore";
import { Plus } from "lucide-react";

type FormData = z.infer<typeof AddRewardSchema>;

export default function AddRewardForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
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
      description: "",
      required_points: 10,
    },
  });

  // const addChildModal = document.getElementById(
  //   "addChildModal"
  // ) as HTMLDialogElement | null;

  const onSubmit = async (data: FormData) => {
    setError("");
    setMessage("");

    startTransition(async () => {
      try {
        const res = await fetch("/api/rewards", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        const resData = await res.json();

        if (!res.ok) {
          setError(
            resData.error || "登録に失敗しました。入力内容を確認してください。"
          );
          return;
        }

        // setMessage(resData.message || "登録完了！");
        reset(); // フォームをクリア

        // 子どもリストを更新
        // await fetchChildList();
        // addChildModal?.close();
        modalRef.current?.close(); // モーダルを閉じる
        // router.refresh();
      } catch (err) {
        console.error("ネットワークエラーまたは予期しないエラー:", err);
        setError(
          "サーバーへの接続に失敗しました。しばらくしてから再度お試しください"
        );
      }
    });
  };

  const handleModal = () => {
    modalRef.current?.showModal();
  };

  return (
    <>
      <button className="btn" onClick={handleModal}>
        景品追加
        <Plus width={20} height={20} />
      </button>
      <dialog ref={modalRef} className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="mb-4 text-center">景品追加</h3>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-base-200 border border-base-300 p-4 rounded-box"
          >
            <fieldset className="fieldset">
              <label className="fieldset-label">景品名</label>
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

              <button type="submit" className="btn btn-neutral mt-4 w-full">
                {isPending ? "登録中..." : "追加"}
              </button>
            </fieldset>

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
