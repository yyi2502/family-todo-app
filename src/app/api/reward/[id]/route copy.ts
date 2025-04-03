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
      .from("rewards")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return handleErrorResponse(error, "データ取得に失敗しました。");
    }

    if (!data) {
      return new Response(
        JSON.stringify({ error: "rewardsが見つかりません。" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return handleErrorResponse(error, "サーバーエラーが発生しました。");
  }
}

// rewards更新
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const supabase = await createClient();

  try {
    const requestData = await req.json();
    const {
      title,
      description,
      parent_id,
      child_id,
      required_points,
      is_active,
    } = requestData;

    const { data, error } = await supabase
      .from("rewards")
      .update({
        title,
        description,
        parent_id,
        child_id,
        required_points,
        is_active,
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

// rewards削除
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const supabase = await createClient();

  try {
    // 指定された ID の rewards を削除
    const { error } = await supabase.from("rewards").delete().eq("id", id);

    if (error) {
      return handleErrorResponse(error, "データ削除に失敗しました。");
    }

    return new Response(
      JSON.stringify({ message: "rewardsを削除しました。" }),
      {
        status: 200,
      }
    );
  } catch (error) {
    return handleErrorResponse(error, "サーバーエラーが発生しました。");
  }
}
