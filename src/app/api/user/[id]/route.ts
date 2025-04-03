import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

// 特定のユーザー情報を取得 (GET)
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 });
  }

  return NextResponse.json(data, { status: 200 });
}

// user情報更新
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const body = await req.json(); // 更新データを取得

  const supabase = await createClient();

  // `total_point` の加算リクエストかどうかを確認
  if (body.points !== undefined) {
    // 現在の total_point を取得
    const { data: user, error: fetchError } = await supabase
      .from("users")
      .select("total_point")
      .eq("id", id)
      .single();

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    // 新しい total_point を計算
    const newTotalPoint = (user?.total_point || 0) + body.points;

    // total_point を更新
    const { data, error } = await supabase
      .from("users")
      .update({ total_point: newTotalPoint })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 200 });
  }

  // 通常の更新処理 (total_point 以外)
  const { data, error } = await supabase
    .from("users")
    .update(body)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 200 });
}

// 特定のユーザーを削除 (DELETE)
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const supabase = await createClient();
  const { error } = await supabase.from("users").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    { message: "User deleted successfully" },
    { status: 200 }
  );
}
