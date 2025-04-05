import { useUserStore } from "@/stores/userStore";

export function NameDisplay({ id }: { id: string }) {
  const parentData = useUserStore((state) => state.parentData);
  const childList = useUserStore((state) => state.childList);

  // ヘルパー関数をコンポーネント内に定義
  const getName = (id: string) => {
    const child = childList.find((c) => c.id === id);
    if (child) return child.name;

    return "未登録";
  };

  return <> {getName(id)}</>;
}
