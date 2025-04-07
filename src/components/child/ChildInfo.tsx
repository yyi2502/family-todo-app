"use client";

import { useUserStore } from "@/stores/userStore";
import { useChildActions } from "@/hooks/useChildActions";
import { UserType } from "@/types";
import { X } from "lucide-react";
import UpdateChildModal from "./UpdateChildModal";

export default function ChildInfo({ childId }: { childId: string }) {
  const { deleteChild } = useChildActions();
  const selectedUser = useUserStore((state) => state.selectedUser);
  const childList = useUserStore((state) => state.childList);
  const child: UserType | undefined = childList.find((c) => c.id === childId);

  // ユーザー削除
  const handleDeleteChild = () => {
    deleteChild(childId);
  };

  if (!child) return <p>子ユーザーが見つかりません</p>;

  return (
    <div className="bg-white shadow-md p-4 rounded">
      <div className="flex gap-3 items-center">
        <div className="avatar avatar-placeholder">
          <div className="bg-neutral text-neutral-content w-24 rounded-full">
            <span className="text-3xl">{child.name}</span>
          </div>
        </div>
        <div>
          <p>
            <span className="text-2xl">{child.total_points}</span>ポイント
          </p>
          <div className="mt-2">
            <p className="text-sm">
              1000ポイントまであと
              <span className="text-lg">
                {Number(1000 - child.total_points)}
              </span>
            </p>
            <progress
              className="progress progress-info w-56"
              value={child.total_points}
              max="1000"
            ></progress>
          </div>
        </div>
      </div>
      {selectedUser?.role === "parent" && (
        <>
          <div className="mt-4 flex gap-3">
            <UpdateChildModal childId={child.id} />
            <button onClick={handleDeleteChild} className="btn btn-error">
              削除
              <X />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
