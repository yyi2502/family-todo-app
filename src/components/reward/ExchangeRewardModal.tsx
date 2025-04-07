"use client";

import { useRef } from "react";
import { useUserStore } from "@/stores/userStore";
import { ThumbsUp } from "lucide-react";
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
      <button
        className="btn btn-accent btn-lg"
        onClick={handleModal}
        disabled={isDisable}
      >
        こうかん
      </button>
      <dialog ref={modalRef} className="modal">
        <div className="modal-box text-center bg-amber-100">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <p className="underline">おとなのひとに みせてね</p>
          <p className="text-3xl mt-10">{reward.title}</p>
          <p className="text-3xl mt-2">
            <span className="underline">{reward.required_points}</span>ポイント
          </p>

          <p className="flex justify-center mt-7">
            <button
              className="btn btn-accent btn-xl flex items-center align-middle"
              onClick={() => handleCalcPoints()}
            >
              <ThumbsUp />
              <span className="">ポイントをつかいます！</span>
            </button>
          </p>

          <p className="text-xl text-center mt-7">
            {selectedUser && (
              <>
                <NameDisplay id={selectedUser.id} />
                さんのポイント：
                <span className="text-3xl underline">
                  {selectedUser.total_points}
                </span>
              </>
            )}
          </p>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
