"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { SigninSchema } from "@/schemas";
import Link from "next/link";

type FormData = z.infer<typeof SigninSchema>;

export default function SigninForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(SigninSchema),
  });

  const onSubmit = async (data: FormData) => {
    setError("");
    setMessage("");

    startTransition(async () => {
      console.log({ ...data, action: "signin" });
      try {
        const res = await fetch("/api/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, action: "signin" }),
        });

        const resData = await res.json();

        if (!res.ok) {
          setError(
            resData.error ||
              "ログインに失敗しました。入力内容を確認してください。"
          );
          return;
        }

        setMessage(resData.message || "ログイン成功！");
        router.push("/main");
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
        className="bg-base-200 border border-base-300 p-4 rounded-box"
      >
        <fieldset className="fieldset">
          <label className="fieldset-label">Email</label>
          <input
            type="email"
            {...register("email")}
            className="input w-full text-black"
            placeholder="Email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}

          <label className="fieldset-label mt-2">Password</label>
          <input
            type="password"
            {...register("password")}
            className="input w-full text-black"
            placeholder="Password"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
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
        <Link href="/signup" className="border-b">
          新規登録はこちら
        </Link>
      </div>
    </>
  );
}
