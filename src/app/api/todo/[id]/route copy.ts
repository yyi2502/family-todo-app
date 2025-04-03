import { createClient } from "@/utils/supabase/server";

// エラーレスポンスを生成するヘルパー関数
function createErrorResponse(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), { status });
}

// 成功レスポンスを生成するヘルパー関数
function createSuccessResponse(
  message: string,
  data: any = null,
  status: number = 200
) {
  return new Response(JSON.stringify({ message, data }), { status });
}

// GETリクエスト処理
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  console.log(id);
  const supabase = await createClient();

  try {
    const { data, error }: { data: any[] | null; error: any } = await supabase
      .from("todos")
      .select(
        "id, title, status, description, parent_id, child_id, is_recommended, points"
      )
      .eq("id", id);

    if (error) {
      return createErrorResponse(error.message, 400);
    }

    if (!data || data.length === 0) {
      return createErrorResponse("Todo がありません。", 404);
    }

    return createSuccessResponse("Todo の取得に成功しました。", data[0]);
  } catch (error) {
    return createErrorResponse("サーバーエラーが発生しました。", 500);
  }
}

// PUTリクエスト処理
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

    if (!title || !status) {
      return createErrorResponse("title と status は必須です。", 400);
    }

    // child_id が空文字なら null に変換
    const validChildId = child_id === "" ? null : child_id;

    const { data, error } = await supabase
      .from("todos")
      .update({
        title,
        status,
        description,
        child_id: validChildId,
        is_recommended,
        points,
      })
      .eq("id", id);

    if (error) {
      return createErrorResponse(error.message, 400);
    }

    if (!data || data.length === 0) {
      return createErrorResponse("Todo が見つかりません。", 404);
    }

    return createSuccessResponse("Todo の更新が完了しました。", data);
  } catch (error) {
    return createErrorResponse("サーバーエラーが発生しました。", 500);
  }
}
