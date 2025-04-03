"use client";
import { useState, useEffect } from "react";
import { useUserStore } from "@/stores/userStore";
import { useParams, useRouter } from "next/navigation";
import TodoList from "../todo/TodoList";
import ChildInfo from "./ChildInfo";

interface ChildDetailProps {
  childId: string;
}

interface Todo {
  id: string;
  title: string;
  status: string;
}

interface Child {
  id: string;
  name: string;
  total_points: number;
}

export default function ChildDetail({ childId }: ChildDetailProps) {
  const router = useRouter();

  const selectedUser = useUserStore((state) => state.selectedUser);
  const { childList, setChildList } = useUserStore();
  const child: Child | undefined = childList.find((c) => c.id === childId);

  const [newName, setNewName] = useState<string>(child?.name || "");
  const [newTotalPoints, setNewTotalPoints] = useState<number>(
    child?.total_points || 0
  );
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string>("");

  // ユーザー情報更新
  const handleUpdateChild = async () => {
    try {
      const response = await fetch(`/api/child/${childId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newName,
          total_points: newTotalPoints,
        }),
      });

      if (!response.ok) throw new Error("更新に失敗しました");

      const updatedChild: Child = await response.json();

      setChildList(
        childList.map((c) => (c.id === childId ? { ...c, ...updatedChild } : c))
      );
      setIsEditing(false);
    } catch (err) {
      // alert(err.message);
    }
  };

  // ユーザー削除
  const handleDeleteChild = async () => {
    if (!confirm("この子ユーザーを削除しますか？")) return;
    try {
      const response = await fetch(`/api/child/${childId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("削除に失敗しました");

      setChildList(childList.filter((c) => c.id !== childId));
      router.push("/main/parent"); // 削除後のリダイレクト
    } catch (err) {
      // alert(err.message);
    }
  };

  if (!child) return <p>子ユーザーが見つかりません</p>;

  return (
    <>
      {/* {isEditing ? (
        <div className="bg-gray-100 p-4 rounded">
          <label className="block">
            名前：
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="input w-full"
            />
          </label>
          <label className="block mt-2">
            累計ポイント：
            <input
              type="number"
              value={newTotalPoints}
              onChange={(e) => setNewTotalPoints(Number(e.target.value))}
              className="input w-full"
            />
          </label>
          <div className="mt-4">
            <button
              onClick={handleUpdateChild}
              className="btn btn-primary mr-2"
            >
              保存
            </button>
            <button onClick={() => setIsEditing(false)} className="btn">
              キャンセル
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-md p-4 rounded">
          <div className="flex gap-4">
            <label className="swap swap-flip text-9xl">
              <input type="checkbox" />

              <div className="swap-on">😈</div>
              <div className="swap-off">😇</div>
            </label>
            <h2 className="text-xl font-bold">{child.name}</h2>
            <p>累計ポイント: {child.total_points}</p>
          </div>
          <progress
            className="progress progress-info w-56"
            value="60"
            max="100"
          ></progress>
          {selectedUser?.role === "parent" && (
            <>
              <div className="mt-4">
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
            </>
          )}
        </div>
      )} */}

      <ChildInfo childId={childId} />

      <h3 className="text-lg font-semibold mt-6">やること！</h3>
      <TodoList child_id={childId} />

      <h3 className="text-lg font-semibold mt-6">おすすめ</h3>
      <TodoList is_recommended={true} />

      <h3 className="text-lg font-semibold mt-6">クリア</h3>
      <TodoList status={"completed"} />
    </>
  );
}
