"use client";

export function useRewardActions() {}

// // Read--------------------------------
// // todo読み込み
// // ・全件
// // ・条件あり
// const fetchTodos = async (
//   child_id?: string,
//   is_recommended?: boolean,
//   status?: "pending" | "processing" | "completed"
// ) => {
//   try {
//     const url = new URL("/api/todo", window.location.origin);

//     if (child_id) url.searchParams.append("child_id", child_id);
//     if (is_recommended !== undefined)
//       url.searchParams.append("is_recommended", String(is_recommended));
//     if (status) url.searchParams.append("status", status);

//     const response = await fetch(url.toString());
//     const todos = await response.json();
//     if (!response.ok) throw new Error(todos.error);

//     return todos;
//   } catch (err) {
//     console.error("ToDoの取得に失敗しました", err);
//     throw new Error("ToDoの取得に失敗しました");
//   }
// };

// // total_point の更新
// const updateTotalPoints = async (todoPoints: number) => {
//   try {
//     const response = await fetch(`/api/user/${child_id}`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         points: todoPoints, // 加算するポイント数
//       }),
//     });

//     if (!response.ok) throw new Error("ポイントの更新に失敗しました");
//   } catch (err) {
//     setError("ポイントの更新に失敗しました");
//     console.error(err);
//   }
// };
//
//
//
// "use client";
// import { useRouter } from "next/navigation";
// import { useUserStore } from "@/stores/userStore";
// import { useCallback } from "react";
// import { UserType } from "@/types";
// import { useFetchChildren } from "./useFetchChildren";

// // UPDATE--------------------------------
// // ユーザー情報更新
// // storeのデータ更新

// // 使い方
// // const { updateChild } = useChildActions();
// // updateChild(userid,{name:"",total_points:00}, ()=>{}}
// // 更新するユーザーid（必須）
// // 更新するデータ（一方でもOK）
// // 終了後の処理

// // 例
// // selectedUser.id, { total_points: result }, () =>
// //   modalRef.current?.close()
// // );

// export function useRewardActions() {
//   const router = useRouter();
//   // const childList = useUserStore((state) => state.childList);
//   // const setChildList = useUserStore((state) => state.setChildList);

//   // 子ユーザーを更新（name だけ, total_points だけなどにも対応）
//   const updateReward = useCallback(
//     async (
//       updates: {
//         id: string;
//         title?: string;
//         description?: string;
//         required_points?: number;
//       },
//       onSuccess?: () => void
//     ) => {
//       try {
//         const response = await fetch(`/api/reward/${updates.id}`, {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(updates), // 渡されたプロパティのみ更新
//         });
//         if (!response.ok) throw new Error("更新に失敗しました");

//         const data = await response.json();

//         // // store情報を更新
//         // const newChildList = childList.map((c) =>
//         //   c.id === childId ? { ...c, ...data.child } : c
//         // );
//         // setChildList(newChildList);

//         if (onSuccess) onSuccess(); // 成功時の処理
//       } catch (err) {
//         console.error("更新エラー:", err);
//       }
//     },
//     []
//   );

//   // // DELETE--------------------------------
//   // // 子ユーザー情報削除
//   // // storeのデータ削除

//   // // 使い方
//   // // const { deleteChild } = useChildActions();
//   // // deleteChild(userid)

//   // // 例
//   // // selectedUser.id, { total_points: result }, () =>
//   // //   modalRef.current?.close()
//   // // );
//   // const deleteChild = useCallback(
//   //   async (childId: string) => {
//   //     if (!confirm("この子ユーザーを削除しますか？")) return;
//   //     try {
//   //       const response = await fetch(`/api/child/${childId}`, {
//   //         method: "DELETE",
//   //       });
//   //       if (!response.ok) throw new Error("削除に失敗しました");

//   //       // store情報を更新
//   //       const newChildList = childList.filter((c) => c.id !== childId);
//   //       setChildList(newChildList);

//   //       router.push("/main/parent"); // 削除後のリダイレクト
//   //     } catch (err) {
//   //       console.error("削除エラー:", err);
//   //     }
//   //   },
//   //   [setChildList, router]
//   // );

//   // // ADD--------------------------------
//   // // 子ユーザー追加
//   // // storeのデータ更新

//   // // 使い方
//   // // const { addChild } = useChildActions();
//   // // addChild({ ...data, parent_id: parentData?.id || "" }, ()=>{}}
//   // // フォームの内容（name）
//   // // parent_id
//   // // 終了後の処理

//   // // 例
//   // // addChild({ ...data, parent_id: parentData?.id || "" }, () => {
//   // //   modalRef.current?.close();
//   // //   reset();
//   // // });
//   // const addChild = useCallback(
//   //   async (newUser: { name: string }, onSuccess?: () => void) => {
//   //     try {
//   //       const res = await fetch("/api/child", {
//   //         method: "POST",
//   //         headers: { "Content-Type": "application/json" },
//   //         body: JSON.stringify(newUser),
//   //       });

//   //       if (!res.ok) throw new Error("子ユーザー追加に失敗しました");

//   //       const data = await res.json();

//   //       // store情報を更新
//   //       // useUserStore.getState().childList：Zustand の最新情報を取得
//   //       const newChildList = [...useUserStore.getState().childList, data.child];
//   //       setChildList(newChildList);

//   //       if (onSuccess) {
//   //         onSuccess();
//   //       } // 成功時の処理
//   //     } catch (err) {
//   //       console.error("追加エラー:", err);
//   //     }

//   //     // try {
//   //     //   const response = await fetch("/api/child", {
//   //     //     method: "POST",
//   //     //     headers: { "Content-Type": "application/json" },
//   //     //     body: JSON.stringify(newUser), // 新しい子ユーザー情報
//   //     //   });
//   //     //   if (!response.ok) throw new Error("子ユーザー追加に失敗しました");
//   //     //   alert(newUser);
//   //     //   const data = await response.json();

//   //     //   // store情報を更新
//   //     //   // useUserStore.getState().childList：Zustand の最新情報を取得
//   //     //   const newChildList = [...useUserStore.getState().childList, data.child];
//   //     //   setChildList(newChildList);

//   //     //   if (onSuccess) {
//   //     //     onSuccess();
//   //     //   } // 成功時の処理
//   //     // } catch (err) {
//   //     //   console.error("追加エラー:", err);
//   //     // }
//   //   },
//   //   [setChildList]
//   // );

//   return { updateReward };
// }
