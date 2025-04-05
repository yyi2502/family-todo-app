"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/stores/userStore";
import { useRewardStore } from "@/stores/rewardStore";
import { useTodoActions } from "@/hooks/useTodoActions";
import { useChildActions } from "@/hooks/useChildActions";
import { RewardPropsType, RewardType, TodoType } from "@/types";
import { Delete, Star } from "lucide-react";
import { NameDisplay } from "../user/NameDisplay";
import UpdateRewardModal from "./___UpdateRewardModal";

export default function RewardList({
  child_id,
  is_active,
  required_points,
}: RewardPropsType) {
  const selectedUser = useUserStore((state) => state.selectedUser);
  const { refetchReward, setRefetchReward } = useRewardStore();
  const [rewards, setRewards] = useState<RewardType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { fetchTodos, updateTodo, deleteTodo } = useTodoActions();
  const { updateChild } = useChildActions();

  // 初回ロード
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchRewards(child_id, is_active, required_points);
        setRewards(data);
      } catch (err) {
        setError("rewardの取得に失敗しました");
      }
    };
    fetchData(); // 初回ロードで必ず取得
  }, []);

  // rewardリストを取得
  useEffect(() => {
    const fetchData = async () => {
      console.log("fetchRewards");
      try {
        const data = await fetchRewards(child_id, is_active, required_points);
        setRewards(data);
      } catch (err) {
        setError("rewardの取得に失敗しました");
      } finally {
        setRefetchReward(false); // フェッチ完了後、フラグをリセット
      }
    };
    if (refetchReward) {
      fetchData();
    }
  }, [refetchReward, setRefetchReward]);

  // // status 更新
  // const handleUpdateStatus = async (
  //   todoId: string,
  //   newStatus: "pending" | "processing" | "completed",
  //   points?: number
  // ) => {
  //   if (selectedUser) {
  //     const updatedData = {
  //       status: newStatus,
  //       child_id: newStatus === "pending" ? "" : selectedUser.id,
  //     };
  //     updateTodo(todoId, updatedData);

  //     //ポイント更新
  //     if (newStatus === "completed" && points) {
  //       const newTotalPoints = selectedUser.total_points + points;
  //       updateChild(selectedUser.id, { total_points: newTotalPoints });
  //     }
  //   }
  // };

  // reward の削除
  const handleDelete = async (e: React.MouseEvent, rewardId: string) => {
    e.preventDefault();
    deleteReward(rewardId);
  };

  return (
    <div className="list bg-base-100 rounded-box shadow-md">
      {error && <p className="text-red-500">{error}</p>}
      {rewards.length > 0 ? (
        <ul>
          {rewards.map((reward) => (
            <li
              key={reward.id}
              className="list-row flex justify-between items-center"
            >
              <div>
                {reward.is_active && (
                  <div>
                    <Star />
                  </div>
                )}
                <div>{reward.title}</div>
                <div>{reward.required_points}</div>
                {reward.description && (
                  <div className="text-xs uppercase font-semibold opacity-60">
                    {reward.description}
                  </div>
                )}
              </div>

              <div className="flex gap-2 items-center">
                {/* 子どもユーザー向けの表示 */}
                {/* {selectedUser?.role === "child" ? (
                  <>
                    {todo.status === "pending" && (
                      <button
                        className="btn btn-sm bg-blue-500 text-white"
                        onClick={() =>
                          handleUpdateStatus(todo.id, "processing")
                        }
                      >
                        やる！
                      </button>
                    )}

                    {todo.status === "processing" ? (
                      selectedUser.id === todo.child_id ? (
                        <>
                          <button
                            className="btn btn-sm bg-green-500 text-white"
                            onClick={() =>
                              handleUpdateStatus(
                                todo.id,
                                "completed",
                                todo.points
                              )
                            }
                          >
                            やった！
                          </button>
                          <button
                            className="btn btn-sm bg-gray-500 text-white"
                            onClick={() =>
                              handleUpdateStatus(todo.id, "pending")
                            }
                          >
                            やめる
                          </button>
                        </>
                      ) : (
                        <span className="text-sm text-gray-500">
                          <NameDisplay id={todo.child_id} />
                          ：やっています
                        </span>
                      )
                    ) : null}

                    {todo.status === "completed" && (
                      <span className="text-sm text-gray-500">
                        <NameDisplay id={todo.child_id} />
                        ：クリア済みだよ！
                      </span>
                    )}
                  </>
                ) : ( */}
                <>
                  {/* 親ユーザー向けの表示 */}
                  {/* {todo.status !== "pending" && (
                      <span className="text-sm text-gray-500">
                        <NameDisplay id={todo.child_id} />：
                        {todo.status === "processing"
                          ? "やっています"
                          : "クリア済み"}
                      </span>
                    )} */}

                  {/* 編集・削除ボタン */}
                  {/* <UpdateRewardModal rewardId={reward.id} /> */}
                  <button
                    className="btn btn-square btn-ghost"
                    onClick={(e) => handleDelete(e, reward.id)}
                  >
                    <Delete />
                  </button>
                </>
                {/* )} */}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">ありません</p>
      )}
    </div>
  );
}
