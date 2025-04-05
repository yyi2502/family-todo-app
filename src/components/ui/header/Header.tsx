"use client";
import { useUserStore } from "@/stores/userStore";
import { usePathname, useRouter } from "next/navigation";
import {
  AlignJustify,
  LogOut,
  RefreshCw,
  SquareX,
  Star,
  UserCog,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import ChildList from "@/components/child/ChildList";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const parentData = useUserStore((state) => state.parentData);
  const selectedUser = useUserStore((state) => state.selectedUser);
  const clearUser = useUserStore((state) => state.clearUser);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // pathname が変更されたらドロワーを閉じる
  useEffect(() => {
    setIsDrawerOpen(false);
  }, [pathname]);

  if (!parentData) return null;

  // 未ログイン時は非表示
  if (!parentData) {
    return null;
  }

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "signout" }),
      });
      const resData = await res.json();

      if (!res.ok) {
        console.error(
          resData.error ||
            "ログアウトに失敗しました。入力内容を確認してください。"
        );
        return;
      }
      clearUser();
      router.push("/");
      setIsDrawerOpen(false); // サインアウト時にドロワーを閉じる
    } catch (err) {
      console.error("ネットワークエラーまたは予期しないエラー:", err);
    }
  };

  return (
    <>
      <div className="drawer drawer-end">
        <input
          id="my-drawer-3"
          type="checkbox"
          className="drawer-toggle"
          checked={isDrawerOpen}
          onChange={() => setIsDrawerOpen(true)}
        />

        <div className="drawer-content flex flex-col">
          {/* Navbar */}
          <div className="navbar bg-base-300 w-full justify-between">
            <div className="mx-2 px-2 flex gap-5 items-center">
              {selectedUser ? (
                selectedUser.role === "child" ? (
                  // selectedUser が "child" の場合
                  <Link
                    href={`/main/child/${selectedUser.id}`}
                    className="flex gap-1 items-center"
                    onClick={() => setIsDrawerOpen(false)}
                  >
                    <Star width={22} height={22} className="text-yellow-500" />
                    <p>{selectedUser.name}</p>
                  </Link>
                ) : (
                  // selectedUser が "child" でない場合
                  <Link
                    href={`/main/parent/`}
                    className="flex gap-1 items-center"
                    onClick={() => setIsDrawerOpen(false)}
                  >
                    <UserCog width={22} height={22} />
                    <p>{selectedUser.name}</p>
                  </Link>
                )
              ) : // selectedUser が存在しない場合
              null}
              <Link href={`/main/`} onClick={() => setIsDrawerOpen(false)}>
                <RefreshCw width={20} height={20} />
              </Link>
            </div>
            {selectedUser?.role === "parent" && (
              <div className="flex-none">
                <label
                  htmlFor="my-drawer-3"
                  aria-label="open sidebar"
                  className="btn btn-square btn-ghost"
                  onClick={() => setIsDrawerOpen(true)}
                >
                  <AlignJustify />
                </label>
              </div>
            )}
          </div>
        </div>

        {selectedUser?.role === "parent" && (
          // 親ユーザーにのみ表示
          <div className="drawer-side z-100">
            <label
              htmlFor="my-drawer-3"
              aria-label="close sidebar"
              className="drawer-overlay"
              onClick={() => setIsDrawerOpen(false)}
            ></label>
            <button
              onClick={() => setIsDrawerOpen(false)}
              className="pt-2 pr-6 z-50"
            >
              <SquareX />
            </button>
            <ul className="menu bg-base-200 min-h-full w-80 p-4">
              {/* {parentData ? (
              {selectedUser.role === "parent" && 
              <> */}
              <li>おとな：{parentData?.name}さん</li>
              <li>
                子ユーザー
                <ChildList />
              </li>
              <li>
                <Link href="/main/todo" onClick={() => setIsDrawerOpen(false)}>
                  やること一覧
                </Link>
              </li>
              <li>
                <Link
                  href="/main/reward"
                  onClick={() => setIsDrawerOpen(false)}
                >
                  リワード一覧
                </Link>
              </li>
              {/* <li>
                <Link href="/setting" onClick={() => setIsDrawerOpen(false)}>
                  設定
                </Link>
              </li> */}
              <li>
                <button
                  onClick={handleSignout}
                  className="p-2 bg-transparent border-none cursor-pointer hover:scale-110 transition-transform"
                >
                  <LogOut />
                  ログアウト
                </button>
              </li>
              {/* </>}
            ) : (
              <>
                <li>
                  <Link href="/signin" onClick={() => setIsDrawerOpen(false)}>
                    ログイン
                  </Link>
                </li>
                <li>
                  <Link href="/signup" onClick={() => setIsDrawerOpen(false)}>
                    新規登録
                  </Link>
                </li>
              </>
            )} */}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
