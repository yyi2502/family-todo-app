"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AddChildSchema } from "@/schemas";
import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/userStore";
import { Plus } from "lucide-react";

type FormData = z.infer<typeof AddChildSchema>;

export default function UpdateChildForm() {
  const router = useRouter();
  // const userData = useUserStore((state) => state.userData);
  const setChildList = useUserStore((state) => state.setChildList);
  // const fetchChildList = useUserStore((state) => state.fetchChildList);
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
    resolver: zodResolver(AddChildSchema),
  });

  // const addChildModal = document.getElementById(
  //   "addChildModal"
  // ) as HTMLDialogElement | null;

  const onSubmit = async (data: FormData) => {
    setError("");
    setMessage("");

    startTransition(async () => {
      try {
        const res = await fetch("/api/child", {
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
        子どもユーザー追加
        <Plus width={20} height={20} />
      </button>
      <dialog ref={modalRef} className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="mb-4">Todo追加</h3>
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
                {isPending ? "登録中..." : "追加"}
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
