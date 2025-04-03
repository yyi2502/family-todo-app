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
      <div>
        <h2 className="text-xl font-bold">{child.name}</h2>
        <p>ポイント: {child.total_points}</p>
      </div>
      <progress
        className="progress progress-info w-56"
        value={child.total_points}
        max="100"
      ></progress>
      {selectedUser?.role === "parent" && (
        <>
          <div className="mt-4">
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
