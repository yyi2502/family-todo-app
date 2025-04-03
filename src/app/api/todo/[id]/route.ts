import { createClient } from "@/utils/supabase/server";

async function handleErrorResponse(error: any, defaultMessage: string) {
  return new Response(
    JSON.stringify({ error: error.message || defaultMessage }),
    { status: error.status || 500 }
  );
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("todos")
      .select(
        "id, title, status, description, parent_id, child_id, is_recommended, points"
      )
      .eq("id", id)
      .single(); // 一つのレコードのみ取得

    if (error) {
      return handleErrorResponse(error, "データ取得に失敗しました。");
    }

    if (!data) {
      return new Response(
        JSON.stringify({ error: "Todo が見つかりません。" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return handleErrorResponse(error, "サーバーエラーが発生しました。");
  }
}

// todo更新
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const supabase = await createClient();

  try {
    const requestData = await req.json();
    const { title, status, description, child_id, is_recommended, points } =
      requestData;

    // if (!title || !status) {
    //   return new Response(
    //     JSON.stringify({ error: "title と status は必須です。" }),
    //     { status: 400 }
    //   );
    // }

    const { data, error } = await supabase
      .from("todos")
      .update({
        title,
        status,
        description,
        child_id: child_id || null,
        is_recommended,
        points,
      })
      .eq("id", id);

    if (error) {
      return handleErrorResponse(error, "データ更新に失敗しました。");
    }

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return handleErrorResponse(error, "サーバーエラーが発生しました。");
  }
}

// todo削除
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const supabase = await createClient();

  try {
    // 指定された ID の Todo を削除
    const { error } = await supabase.from("todos").delete().eq("id", id);

    if (error) {
      return handleErrorResponse(error, "データ削除に失敗しました。");
    }

    return new Response(JSON.stringify({ message: "Todo を削除しました。" }), {
      status: 200,
    });
  } catch (error) {
    return handleErrorResponse(error, "サーバーエラーが発生しました。");
  }
}
