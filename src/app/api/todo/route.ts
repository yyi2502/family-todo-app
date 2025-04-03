import { createClient } from "@/utils/supabase/server";

async function handleErrorResponse(error: any, status: number) {
  return new Response(
    JSON.stringify({
      error: error.message || "サーバーエラーが発生しました。",
    }),
    {
      status,
    }
  );
}

// todo追加
export async function POST(req: Request) {
  const supabase = await createClient();
  const requestData = await req.json();
  const {
    title,
    status,
    description,
    parent_id,
    child_id,
    is_recommended,
    points,
  } = requestData;

  try {
    const { data, error } = await supabase
      .from("todos")
      .insert({
        title,
        status,
        description,
        parent_id,
        child_id: child_id || null,
        is_recommended: is_recommended || false,
        points: points || 0,
      })
      .single();

    if (error) {
      return handleErrorResponse(error, 400);
    }

    return new Response(JSON.stringify(data), { status: 201 });
  } catch (error) {
    return handleErrorResponse(error, 500);
  }
}

// todo取得
export async function GET(req: Request) {
  const supabase = await createClient();
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const title = searchParams.get("title");
  const child_id = searchParams.get("child_id");
  const is_recommended = searchParams.get("is_recommended");

  try {
    let query = supabase.from("todos").select("*");

    if (status) {
      query = query.eq("status", status);
    }

    if (title) {
      query = query.ilike("title", `%${title}%`);
    }

    if (child_id) {
      query = query.eq("child_id", child_id);
      query = query.neq("status", "completed");
    }

    if (is_recommended) {
      query = query.eq("is_recommended", true);
      query = query.neq("status", "completed");
    }

    const { data, error } = await query;

    if (error) {
      return handleErrorResponse(error, 400);
    }

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return handleErrorResponse(error, 500);
  }
}
