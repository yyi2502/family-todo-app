"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AddRewardSchema } from "@/schemas";
import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/userStore";
import { Medal, Plus, ThumbsUp } from "lucide-react";
import { RewardType } from "@/types";
import { useChildActions } from "@/hooks/useChildActions";

interface UseRewardModalProps {
  reward: RewardType;
}

export default function UseRewardModal({ reward }: UseRewardModalProps) {
  const { updateChild } = useChildActions();
  const selectedUser = useUserStore((state) => state.selectedUser);
  const setSelectedUser = useUserStore((state) => state.setSelectedUser);
  console.log(reward);
  // 所有ポイントがリワードポイントよりも少なくないかチェック
  const isDisable = reward.required_points > (selectedUser?.total_points || 0);

  const modalRef = useRef<HTMLDialogElement | null>(null); // useRefでモーダル要素を取得

  // const addChildModal = document.getElementById(
  //   "addChildModal"
  // ) as HTMLDialogElement | null;

  // const onSubmit = async (data: FormData) => {
  //   setError("");
  //   setMessage("");

  //   startTransition(async () => {
  //     try {
  //       const res = await fetch("/api/rewards", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify(data),
  //       });

  //       const resData = await res.json();

  //       if (!res.ok) {
  //         setError(
  //           resData.error || "登録に失敗しました。入力内容を確認してください。"
  //         );
  //         return;
  //       }

  //       // setMessage(resData.message || "登録完了！");
  //       reset(); // フォームをクリア

  //       // 子どもリストを更新
  //       // await fetchChildList();
  //       // addChildModal?.close();
  //       modalRef.current?.close(); // モーダルを閉じる
  //       // router.refresh();
  //     } catch (err) {
  //       console.error("ネットワークエラーまたは予期しないエラー:", err);
  //       setError(
  //         "サーバーへの接続に失敗しました。しばらくしてから再度お試しください"
  //       );
  //     }
  //   });
  // };

  const handleCalcPoints = () => {
    if (selectedUser) {
      const result = (selectedUser?.total_points || 0) - reward.required_points;
      updateChild(selectedUser.id, { total_points: result }, () =>
        modalRef.current?.close()
      );

      modalRef.current?.close(); // モーダルを閉じる
    } else {
      console.error("User ID is undefined");
    }

    // const { loading, error, fetchChildren } = useFetchChildren();
    // const childList = useUserStore((state) => state.childList);

    // setSelectedUser({ ...selectedUser, total_points: result });
  };

  // const onSubmit = async (data: FormData) => {
  //   setError("");
  //   setMessage("");

  //   startTransition(async () => {
  //     try {
  //       const res = await fetch("/api/child", {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify(data),
  //       });

  //       const resData = await res.json();

  //       if (!res.ok) {
  //         setError(
  //           resData.error || "登録に失敗しました。入力内容を確認してください。"
  //         );
  //         return;
  //       }

  //       // setMessage(resData.message || "登録完了！");
  //       reset(); // フォームをクリア

  //       // 子どもリストを更新
  //       await fetchChildList();
  //       // addChildModal?.close();
  //       modalRef.current?.close(); // モーダルを閉じる
  //       // router.refresh();
  //     } catch (err) {
  //       console.error("ネットワークエラーまたは予期しないエラー:", err);
  //       setError(
  //         "サーバーへの接続に失敗しました。しばらくしてから再度お試しください"
  //       );
  //     }
  //   });
  // };

  const handleModal = () => {
    modalRef.current?.showModal();
  };

  return (
    <>
      <button className="btn" onClick={handleModal} disabled={isDisable}>
        こうかん
        <Medal width={20} height={20} />
      </button>
      <dialog ref={modalRef} className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <p>おとなのひとに みせてね</p>
          <h3 className="mb-4 text-center">ポイントをつかいます！</h3>
          <p className="text-3xl">{reward.title}</p>
          <p className="text-3xl">{reward.required_points}ポイント</p>
          <p className="text-2xl">
            ようた：{selectedUser?.total_points}ポイント
          </p>
          <button className="btn btn-active" onClick={() => handleCalcPoints()}>
            <ThumbsUp />
          </button>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
