import { NextRequest } from "next/server";
import { createClient } from "../supabase/server";

export async function getUser(req: NextRequest) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) return null;
  return data.user;
}
