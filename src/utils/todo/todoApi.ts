export const fetchAllTodos = async (
  child_id?: string,
  is_recommended?: boolean,
  status?: "pending" | "processing" | "completed"
) => {
  try {
    const url = new URL("/api/todo", window.location.origin);

    if (child_id) url.searchParams.append("child_id", child_id);
    if (is_recommended)
      url.searchParams.append("is_recommended", String(is_recommended));
    if (status) url.searchParams.append("status", status);

    const response = await fetch(url.toString());
    const todos = await response.json();
    if (!response.ok) throw new Error(todos.error);

    return todos;
  } catch (err) {
    console.error("ToDoの取得に失敗しました", err);
    throw new Error("ToDoの取得に失敗しました");
  }
};
