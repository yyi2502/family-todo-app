import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { getUser } from "@/utils/auth/auth";

/**
 * 子ユーザー情報を更新
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const user = await getUser(req);
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
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
  { params }: { params: { id: string } }
) {
  const user = await getUser(req);
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  // users テーブルから子ユーザー削除
  const supabase = await createClient();
  const { error } = await supabase.from("users").delete().eq("id", id);

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ message: "Child deleted successfully" });
}
