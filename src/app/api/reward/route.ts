import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

/**
 * reward 取得
 * ・全件
 * ・is_active
 * ・child_idでの検索
 */
//
export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(req.url);
    const child_id = searchParams.get("child_id");
    const is_active = searchParams.get("is_active");

    let query = supabase.from("rewards").select("*");

    if (child_id) {
      query = query.eq("child_id", child_id);
    }

    // is_activeでのフィルタリング
    // if (is_active !== null) {
    //   query = query.eq("is_active", "true");
    // }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}

/**
 * rewards追加
 */
//
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, is_active, required_points, description } = body;

    // 新しいrewardの作成
    const supabase = await createClient();
    const { data: userData } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from("rewards")
      .insert([
        {
          title,
          is_active,
          description,
          required_points: required_points || 100,
          created_by: userData.user?.id,
        },
      ])
      .select("*"); // 作成したデータを返す

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data, { status: 201 }); // 作成成功
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
