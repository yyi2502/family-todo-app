"use client";
import { statusOptions } from "@/constants/statusOptions";
import { useUserStore } from "@/stores/userStore";
import { useEffect, useState } from "react";

export default function TodoDetail({ todoId }: { todoId: string }) {
  const [todo, setTodo] = useState<{
    title: string;
    status: "pending" | "processing" | "completed";
    description: string;
    child_id: string;
    is_recommended: boolean;
    points: number;
  } | null>(null);

  const [newTitle, setNewTitle] = useState("");
  const [newStatus, setNewStatus] = useState("pending");
  const [newDescription, setNewDescription] = useState("");
  const [newChildId, setNewChildId] = useState("");
  const [newIsRecommended, setNewIsRecommended] = useState(false);
  const [newPoints, setNewPoints] = useState(0);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const childList = useUserStore((state) => state.childList);

  useEffect(() => {
    const fetchTodo = async () => {
      try {
        const response = await fetch(`/api/todo/${todoId}`);
        const data = await response.json();

        if (response.ok) {
          setTodo(data);
          setNewTitle(data.title);
          setNewStatus(data.status);
          setNewDescription(data.description || "");
          setNewChildId(data.child_id || "");
          setNewIsRecommended(data.is_recommended || false);
          setNewPoints(data.points || 0);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError("エラーが発生しました。");
      }
    };

    fetchTodo();
  }, [todoId]);

  const handleUpdateTodo = async () => {
    if (!todo) return;
    setLoading(true);

    try {
      const res = await fetch(`/api/todo/${todoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          status: newStatus as "pending" | "processing" | "completed",
          description: newDescription,
          child_id: newChildId,
          is_recommended: newIsRecommended,
          points: newPoints,
        }),
      });

      const resData = await res.json();

      if (res.ok) {
        setTodo({
          ...todo,
          title: newTitle,
          status: newStatus as "pending" | "processing" | "completed",
          description: newDescription,
          child_id: newChildId,
          is_recommended: newIsRecommended,
          points: newPoints,
        });

        setIsEditing(false);
      } else {
        setError(resData.error || "更新に失敗しました");
      }
    } catch (error) {
      setError("エラーが発生しました。");
    }

    setLoading(false);
  };

  if (error) return <div>{error}</div>;

  return (
    <div>
      {todo ? (
        <div>
          {isEditing ? (
            <>
              <form className="bg-base-200 border border-base-300 p-4 rounded-box">
                {/* タイトル入力 */}
                <fieldset className="fieldset">
                  <label className="fieldset-label">ToDo タイトル</label>
                  <input
                    type="text"
                    className="input w-full"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="タイトル"
                  />

                  {/* ステータス選択 */}
                  <label className="fieldset-label">ステータス</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  {/* 説明入力 */}
                  <label className="fieldset-label">説明</label>
                  <textarea
                    value={newDescription}
                    className="textarea w-full"
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="説明"
                  />

                  {/* 子供の選択 */}
                  <label className="fieldset-label">担当のお子さま</label>
                  <select
                    value={newChildId}
                    onChange={(e) => {
                      setNewChildId(e.target.value);
                      if (newChildId) setNewStatus("processing");
                    }}
                  >
                    <option value="">子供を選択</option>
                    {childList.map((child) => (
                      <option key={child.id} value={child.id}>
                        {child.name}
                      </option>
                    ))}
                  </select>

                  {/* おすすめタスクかどうか */}

                  {/* <label>
                    <input
                      type="checkbox"
                      checked={newIsRecommended}
                      onChange={(e) => setNewIsRecommended(e.target.checked)}
                    />
                    おすすめタスクにする
                  </label> */}

                  <label className="fieldset-label">
                    <input
                      type="checkbox"
                      checked={newIsRecommended}
                      onChange={(e) => setNewIsRecommended(e.target.checked)}
                      className="checkbox"
                    />
                    おすすめタスクにする
                  </label>

                  {/* ポイント入力 */}
                  <label className="fieldset-label">ポイント</label>
                  <input
                    type="number"
                    className="input w-full"
                    value={newPoints}
                    onChange={(e) => setNewPoints(Number(e.target.value))}
                    placeholder="ポイント"
                  />

                  <button onClick={handleUpdateTodo} disabled={loading}>
                    {loading ? "保存中..." : "保存"}
                  </button>
                  <button onClick={() => setIsEditing(false)}>
                    キャンセル
                  </button>
                </fieldset>
              </form>
            </>
          ) : (
            <>
              <div className="card bg-base-100 shadow-sm">
                <div className="card-body">
                  <h2 className="card-title">{todo.title}</h2>
                  {todo.description && <>{todo.description}</>}
                  <p>
                    担当：
                    {childList.find((c) => c.id === todo.child_id)?.name ||
                      "未設定"}
                  </p>
                  <p>おすすめタスク：{todo.is_recommended ? "✅" : "❌"}</p>
                  <p>ポイント：{todo.points}</p>
                  <div className="card-actions justify-end">
                    <button onClick={() => setIsEditing(true)}>編集</button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
