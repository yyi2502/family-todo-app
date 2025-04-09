"use client";

import { useUserStore } from "@/stores/userStore";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import useFetchUserData from "@/hooks/useFetchUserData";

function getFirstChar(name?: string): string {
  return name ? name.charAt(0) : "";
}

export default function Home() {
  const router = useRouter();
  const { parentData, childList, selectedUser, setSelectedUser } =
    useUserStore();

  const { loading } = useFetchUserData();

  // 利用者 親ユーザー選択
  const handleParentClick = () => {
    if (parentData?.id) {
      setSelectedUser(parentData.id);
      router.push(`/main/parent`);
    } else {
      console.error("親ユーザーデータがありません");
      router.push(`/`);
    }
  };

  // 利用者 子ユーザー選択
  const handleChildClick = (childId: string) => {
    setSelectedUser(childId);
    router.push(`/main/child/${childId}`);
  };

  // ローディング中は何も表示しない
  if (loading) {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 mb-10">
      <h2 className="text-center text-3xl mb-8">ユーザーきりかえ</h2>
      <div className="flex justify-center w-full mt-10 mb-4">
        <div className="indicator">
          {selectedUser?.role === "parent" && (
            <span className="indicator-item badge badge-success">
              <Star width={20} height={20} />
            </span>
          )}
          <div
            className="avatar avatar-placeholder hover:opacity-50 hover:cursor-pointer"
            onClick={handleParentClick}
          >
            <div className="bg-neutral text-neutral-content w-24 rounded-full">
              <span className="text-3xl">{getFirstChar(parentData?.name)}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full place-items-center">
        {childList.map((child) => (
          <div key={child.id} className="indicator">
            {selectedUser?.id === child.id && (
              <span className="indicator-item badge badge-success">
                <Star width={20} height={20} />
              </span>
            )}
            <div
              className="avatar avatar-placeholder hover:opacity-50 hover:cursor-pointer"
              onClick={() => handleChildClick(child.id)}
            >
              <div className="bg-info text-info-content w-24 rounded-full">
                <span className="text-3xl">{getFirstChar(child.name)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
