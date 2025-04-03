import TodoList from "../todo/TodoList";

interface ChildTodoListsProps {
  childId: string;
}

export default function ChildTodoLists({ childId }: ChildTodoListsProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mt-6">やること！</h3>
      <TodoList child_id={childId} />

      <h3 className="text-lg font-semibold mt-6">おすすめ</h3>
      <TodoList is_recommended={true} />

      <h3 className="text-lg font-semibold mt-6">クリア</h3>
      <TodoList status="completed" />
    </div>
  );
}
