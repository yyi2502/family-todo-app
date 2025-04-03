"use client";

import { useForm } from "react-hook-form";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SignupSchema } from "@/schemas";
import Link from "next/link";

type FormData = z.infer<typeof SignupSchema>;

export default function SignupForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(SignupSchema),
  });

  const onSubmit = async (data: FormData) => {
    setError("");
    setMessage("");

    startTransition(async () => {
      const action = "signup";
      try {
        const res = await fetch("/api/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, action }),
        });

        const resData = await res.json();

        if (!res.ok) {
          setError(
            resData.error || "登録に失敗しました。入力内容を確認してください。"
          );
          return;
        }

        setMessage(resData.message || "登録完了！");
        router.push("/signup/success");
        router.refresh();
      } catch (err) {
        console.error("ネットワークエラーまたは予期しないエラー:", err);
        setError(
          "サーバーへの接続に失敗しました。しばらくしてから再度お試しください"
        );
      }
    });
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-base-200 border border-base-300 p-4 rounded-box w-md mx-auto"
      >
        <fieldset className="fieldset">
          <label className="fieldset-label">お名前</label>
          <input
            type="text"
            {...register("name")}
            className="input w-full"
            placeholder="お名前"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}

          <label className="fieldset-label">Email</label>
          <input
            type="email"
            {...register("email")}
            className="input w-full"
            placeholder="Email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}

          <label className="fieldset-label mt-2">Password</label>
          <input
            type="password"
            {...register("password")}
            className="input w-full"
            placeholder="Password"
          />
          {errors.password ? (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          ) : (
            <p className="text-gray-500 text-sm">
              英数字8文字以上で入力してください
            </p>
          )}

          <button type="submit" className="btn btn-accent mt-4 w-full">
            {isPending ? (
              <>
                <span className="loading loading-ball loading-xs mr-2" />
                ログイン中...
              </>
            ) : (
              "ログイン"
            )}
          </button>
        </fieldset>
      </form>

      {error && <p className="text-red-500">{error}</p>}
      {message && <p className="text-green-500">{message}</p>}

      <div className="text-center mt-5">
        <Link href="/" className="border-b">
          登録済みの方はこちら
        </Link>
      </div>
    </>
  );
}
