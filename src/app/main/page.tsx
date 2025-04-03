"use client";
import { useUserStore } from "@/stores/userStore";
import { createClient } from "@/utils/supabase/client";
import { Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  const parentData = useUserStore((state) => state.parentData);
  const childList = useUserStore((state) => state.childList);
  const selectedUser = useUserStore((state) => state.selectedUser);
  const setSelectedUser = useUserStore((state) => state.setSelectedUser);

  const { fetchParentData, fetchChildrenData } = useUserStore();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const supabase = createClient();
        const { data: userData, error: userError } =
          await supabase.auth.getUser();

        if (userError) {
          console.error("ユーザー情報の取得に失敗:", userError);
          return;
        }

        if (userData?.user) {
          fetchParentData(userData.user.id);
          console.log("親データ取得完了 → 子供データ取得開始");
          fetchChildrenData();
        }
      } catch (error) {
        console.error("データ取得エラー:", error);
      }
    };

    fetchUserData();
  }, [fetchParentData, fetchChildrenData]);

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

  return (
    <div className="flex flex-col items-center">
      <h2>つかうひと</h2>
      <div className="flex justify-center w-full mt-10 mb-4">
        <div className="indicator">
          {selectedUser?.role === "parent" && (
            <span className="indicator-item badge badge-success">
              <Star width={20} height={20} />
            </span>
          )}
          <button className="btn btn-warning" onClick={handleParentClick}>
            {parentData?.name}さん（親ユーザー）
          </button>
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
            <button
              onClick={() => handleChildClick(child.id)}
              className="btn btn-success"
            >
              {child.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
