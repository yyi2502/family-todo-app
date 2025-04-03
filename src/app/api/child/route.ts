import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

/**
 * ToDoリストを取得
 * ・子ユーザー指定
 * ・status指定
 * ・おすすめ指定
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const url = new URL(req.url);
    const child_id = url.searchParams.get("child_id");
    const is_recommended = url.searchParams.get("is_recommended");
    const statusParam = url.searchParams.getAll("status");

    let query = supabase.from("todos").select("*");

    if (child_id) {
      query = query.eq("child_id", child_id);
    }

    if (is_recommended) {
      query = query.eq("child_id", is_recommended);
    }

    if (statusParam.length > 0) {
      query = query.in("status", statusParam);
    }

    const { data, error } = await query;

    if (error) throw new Error(error.message);

    return NextResponse.json({ todos: data });
  } catch (error) {
    console.error("GET API Error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

/**
 * 新しいToDoを追加
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) throw new Error(userError.message);

    const { title, description, points, status, child_id } = await req.json();
    if (!title) {
      return NextResponse.json(
        { error: "タイトルは必須です" },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("todos").insert([
      {
        title,
        description,
        created_by: userData.user.id,
        points,
        status,
        child_id,
      },
    ]);

    if (error) throw new Error(error.message);

    return NextResponse.json(
      { message: "ToDoを追加しました" },
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

/**
 * ToDoのステータス更新
 */
export async function PUT(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { todo_id, status, points, child_id } = await req.json();

    if (!todo_id || !status) {
      return NextResponse.json(
        { error: "todo_id と status は必須です" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("todos")
      .update({ status })
      .eq("id", todo_id);

    if (error) throw new Error(error.message);

    // 完了済みならポイント加算
    if (status === "completed" && points !== undefined) {
      await supabase.rpc("increment_total_points", { child_id, points });
    }

    return NextResponse.json(
      { message: "ToDoのステータスを更新しました" },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT API Error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

/**
 * ToDoの削除
 */
export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { todo_id } = await req.json();

    if (!todo_id) {
      return NextResponse.json(
        { error: "todo_id は必須です" },
        { status: 400 }
      );
    }

    const { error } = await supabase.from("todos").delete().eq("id", todo_id);

    if (error) throw new Error(error.message);

    return NextResponse.json(
      { message: "ToDoを削除しました" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE API Error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
