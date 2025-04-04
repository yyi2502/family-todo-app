import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

/**
 * todo取得
 * ・全件
 * ・status
 * ・child_id
 * ・is_recommendedでの検索
 */
//
export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const child_id = searchParams.get("child_id");
    const is_recommended = searchParams.get("is_recommended");

    let query = await supabase.from("todos").select("*");

    // statusでのフィルタリング
    if (status) {
      query = query.eq("status", status);
    }

    if (child_id) {
      query = query.eq("child_id", child_id);
      query = query.neq("status", "completed");
    }

    // is_recommendedでのフィルタリング
    if (is_recommended !== null) {
      query = query.eq("is_recommended", is_recommended === "true");
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * todo追加
 */
//
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, is_recommended, points, description } = body;

    // 新しいTodoの作成
    const supabase = await createClient();
    const { data: userData } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from("todos")
      .insert([
        {
          title,
          status: "pending",
          description,
          is_recommended: is_recommended || false,
          points: points || 10,
          created_by: userData.user?.id,
        },
      ])
      .select("*"); // 作成したデータを返す

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data, { status: 201 }); // 作成成功
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
