import { createClient } from "@/utils/supabase/server";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabase = await createClient();
  if (req.method === "POST") {
    // 🔹 ユーザーを新規登録
    const { email, password, name } = req.body;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) return res.status(400).json({ error: error.message });

    // ユーザー情報をDBに保存
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .insert([{ id: data.user?.id, name, email }]);

    if (profileError)
      return res.status(400).json({ error: profileError.message });

    return res.status(201).json({ user: data.user, profile });
  }

  if (req.method === "GET") {
    // 🔹 ユーザー一覧を取得
    const { data, error } = await supabase.from("users").select("*");

    if (error) return res.status(400).json({ error: error.message });

    return res.status(200).json({ users: data });
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
