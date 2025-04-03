import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// auth user チェック-----------------------
async function handleGetAuthUser() {
  const supabase = await createClient();
  // ユーザー情報を取得
  const { data: userData, error: userError } = await supabase.auth.getUser();

  // ユーザーが認証されていない場合は401エラーを返す
  if (!userData?.user) {
    return NextResponse.json(
      { error: "もう一度ログインしてください" },
      { status: 401 }
    );
  }

  return userData.user.id;
}

// GET reward取得-----------------------
export async function GET(req: NextRequest) {
  const supabase = await createClient();

  // ログインユーザーの `id` にマッチする `parent_id` を持つrewardを取得
  const { data, error } = await supabase
    .from("rewards")
    .select("*")
    .eq("parent_id", handleGetAuthUser()); // userData.user.idを使用

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

// POST reward追加-----------------------
export async function POST(req: NextRequest) {
  const supabase = await createClient();

  // ユーザー情報を取得
  const { data: userData, error: userError } = await supabase.auth.getUser();

  // ユーザーが認証されていない場合は401エラーを返す
  if (!userData?.user) {
    return NextResponse.json(
      { error: "もう一度ログインしてください" },
      { status: 401 }
    );
  }

  const { title, description, required_points } = await req.json();

  // `rewards`テーブルに子ユーザーを追加
  const { data, error } = await supabase
    .from("rewards")
    .insert([
      {
        title,
        description,
        required_points,
        parent_id: userData.user.id, // ログインしている親ユーザーのIDを設定
      },
    ])
    .select();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ child: data[0] });
}

export async function DELETE(req: NextRequest) {
  const supabase = await createClient();

  const { id } = await req.json();
  const { error } = await supabase.from("rewards").delete().eq("id", id);
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ message: "Deleted successfully" });
}
