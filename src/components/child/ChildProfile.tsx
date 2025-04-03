import { useState } from "react";
import { useUserStore } from "@/stores/userStore";
import { useRouter } from "next/navigation";

interface ChildProfileProps {
  child: {
    id: string;
    name: string;
    total_points: number;
  };
}

export default function ChildProfile({ child }: ChildProfileProps) {
  const router = useRouter();
  const { childList, setChildList } = useUserStore();

  const [newName, setNewName] = useState(child.name);
  const [newTotalPoints, setNewTotalPoints] = useState(child.total_points);
  const [isEditing, setIsEditing] = useState(false);

  // 子ユーザーの更新
  const handleUpdateChild = async () => {
    try {
      const response = await fetch(`/api/child/${child.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, total_points: newTotalPoints }),
      });

      if (!response.ok) throw new Error("更新に失敗しました");

      const updatedChild = await response.json();
      setChildList(
        childList.map((c) => (c.id === child.id ? updatedChild : c))
      );
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  // 子ユーザーの削除
  const handleDeleteChild = async () => {
    if (!confirm("子ユーザーを削除しますか？")) return;

    try {
      const response = await fetch(`/api/child/${child.id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("削除に失敗しました");

      setChildList(childList.filter((c) => c.id !== child.id));
      router.push("/main/parent");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white shadow-md p-4 rounded">
      {isEditing ? (
        <div>
          <label>
            名前：
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="input w-full"
            />
          </label>
          <label>
            累計ポイント：
            <input
              type="number"
              value={newTotalPoints}
              onChange={(e) => setNewTotalPoints(Number(e.target.value))}
              className="input w-full"
            />
          </label>
          <button onClick={handleUpdateChild} className="btn btn-primary mr-2">
            保存
          </button>
          <button onClick={() => setIsEditing(false)} className="btn">
            キャンセル
          </button>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-bold">{child.name}</h2>
          <p>累計ポイント: {child.total_points}</p>
          <progress
            className="progress progress-info w-56"
            value="60"
            max="100"
          ></progress>
          <button
            onClick={() => setIsEditing(true)}
            className="btn btn-secondary mr-2"
          >
            編集
          </button>
          <button onClick={handleDeleteChild} className="btn btn-error">
            削除
          </button>
        </div>
      )}
    </div>
  );
}
