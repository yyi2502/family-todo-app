import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

/**
 * POSTメソッドで会員登録、ログイン、ログアウトを分岐
 */
export async function POST(req: Request) {
  try {
    const { action, email, password, name } = await req.json();
    const supabase = await createClient();

    // --------------------------------------------------
    // 新規会員登録
    // --------------------------------------------------
    if (action === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) {
        return NextResponse.json(
          {
            error:
              "ユーザー情報の登録に失敗しました。時間をおいて再度お試しください。",
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { message: "登録が成功しました", data },
        { status: 200 }
      );
    }

    // --------------------------------------------------
    // ログイン処理
    // --------------------------------------------------
    if (action === "signin") {
      const { data, error: authError } = await supabase.auth.signInWithPassword(
        {
          email,
          password,
        }
      );

      if (authError) {
        return NextResponse.json(
          { error: "ログインに失敗しました。入力内容を確認してください。" },
          { status: 400 }
        );
      }

      const authUser = data.user;
      const authId = authUser.id;
      const authEmail = authUser.email;
      const authName = authUser.user_metadata?.name || "ゲスト";

      // usersテーブルに親ユーザーが存在するかチェック
      const { data: userData } = await supabase
        .from("users")
        .select("id")
        .eq("id", authId)
        .single();

      // すでに登録済みならスキップ
      if (userData) {
        return NextResponse.json(
          { message: "ログイン中です" },
          { status: 200 }
        );
      }

      // 親ユーザーをusersに追加
      const { error: insertError } = await supabase.from("users").insert([
        {
          id: authId,
          name: authName,
          email: authEmail,
          role: "parent",
          created_by: authId,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]);

      if (insertError) {
        return NextResponse.json(
          { message: "ユーザー登録に失敗しました" },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { message: "ユーザーを登録しました" },
        { status: 200 }
      );
    }

    // --------------------------------------------------
    // ログアウト処理
    // --------------------------------------------------
    if (action === "signout") {
      const { error } = await supabase.auth.signOut();
      if (error) {
        return NextResponse.json(
          { error: "ログアウトに失敗しました。入力内容を確認してください。" },
          { status: 400 }
        );
      }
      console.log("ログアウト成功");
      return NextResponse.json({ message: "ログアウト成功" }, { status: 200 });
    }

    return NextResponse.json(
      { error: "不正なリクエストです。" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      {
        error:
          "サーバーで問題が発生しました。しばらくしてから再度お試しください。",
      },
      { status: 500 }
    );
  }
}
