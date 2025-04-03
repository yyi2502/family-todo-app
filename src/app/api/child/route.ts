import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

/**
 * 子ユーザー情報 取得
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw new Error(userError.message);

    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("created_by", userData.user.id)
      .eq("role", "child");

    if (error) throw new Error(error.message);

    return NextResponse.json({ children: data });
  } catch (error) {
    console.error("GET API Error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

/**
 * 子ユーザー情報 追加
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw new Error(userError.message);

    const { name } = await req.json();
    if (!name) {
      return NextResponse.json({ error: "名前は必須です" }, { status: 400 });
    }

    const { error } = await supabase.from("users").insert([
      {
        name,
        total_points: 0,
        role: "child",
        created_by: userData.user.id,
      },
    ]);

    if (error)
      return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json(
      { message: "登録が成功しました" },
      { status: 200 }
    );
  } catch (error) {
    console.error("POST API Error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
