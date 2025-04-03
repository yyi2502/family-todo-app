"use client";
import { useUserStore } from "@/stores/userStore";
import { CircleParking, House, ListTodo } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Dock() {
  const parentData = useUserStore((state) => state.parentData);
  const selectedUser = useUserStore((state) => state.selectedUser);
  const pathname = usePathname(); // 現在のURLパスを取得

  // 未ログイン時は非表示
  if (!parentData || !selectedUser) {
    return null;
  }

  return (
    <div className="dock dock-md">
      {selectedUser?.role === "child" ? (
        <Link
          href={`/main/child/${selectedUser?.id}`}
          className={
            pathname === `/main/child/${selectedUser?.id}` ? "dock-active" : ""
          }
        >
          <House />
          <span className="dock-label">ホーム</span>
        </Link>
      ) : (
        <Link
          href="/main/parent"
          className={pathname === "/main/parent" ? "dock-active" : ""}
        >
          <House />
          <span className="dock-label">ホーム</span>
        </Link>
      )}

      <Link
        href="/main/todo"
        className={pathname === "/main/todo" ? "dock-active" : ""}
      >
        <ListTodo />
        <span className="dock-label">やること</span>
      </Link>

      <Link
        href="/main/reward"
        className={pathname === "/main/reward" ? "dock-active" : ""}
      >
        <CircleParking />
        <span className="dock-label">こうかん</span>
      </Link>
    </div>
  );
}
