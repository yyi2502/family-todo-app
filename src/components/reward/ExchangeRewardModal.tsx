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
import { NameDisplay } from "../user/NameDisplay";
import { runConfetti } from "@/utils/confetti/confetti";

type ExchangeRewardPropsType = {
  reward: RewardType;
};

export default function ExchangeRewardModal({
  reward,
}: ExchangeRewardPropsType) {
  const { updateChild } = useChildActions();
  const selectedUser = useUserStore((state) => state.selectedUser);
  const setSelectedUser = useUserStore((state) => state.setSelectedUser);
  // 所有ポイントがリワードポイントよりも少なくないかチェック
  const isDisable = reward.required_points >= (selectedUser?.total_points || 0);

  const modalRef = useRef<HTMLDialogElement | null>(null); // useRefでモーダル要素を取得

  //ポイント更新
  const handleCalcPoints = () => {
    if (selectedUser) {
      const result = selectedUser.total_points - reward.required_points;
      updateChild(
        selectedUser.id,
        { total_points: result },
        () =>
          // modalRef.current?.close()
          runConfetti() //紙吹雪
      );

      // modalRef.current?.close(); // モーダルを閉じる
    } else {
      console.error("User ID is undefined");
    }
  };

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
          <p className="text-3xl">{reward.title}</p>
          <p className="text-3xl">{reward.required_points}ポイント</p>

          <p className="text-2xl">
            {selectedUser && (
              <>
                <NameDisplay id={selectedUser.id} />
                ：のこり
                <span className="text-3xl">{selectedUser.total_points}</span>
                ポイント
              </>
            )}
          </p>
          <button
            className="btn btn-active flex items-center align-middle"
            onClick={() => handleCalcPoints()}
          >
            <ThumbsUp />
            <span className="text-lg">ポイントをつかいます！</span>
          </button>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
