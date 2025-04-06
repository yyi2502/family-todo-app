import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

/**
 * 子ユーザー情報を更新
 */
export async function PUT(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const { name, total_points } = await req.json();

  // users テーブルの name と total_point を更新
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("users")
    .update({ name, total_points })
    .eq("id", id)
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ child: data });
}

// 子ユーザーを削除
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // users テーブルから子ユーザー削除
  const supabase = await createClient();
  const { error } = await supabase.from("users").delete().eq("id", id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ message: "Child deleted successfully" });
}
