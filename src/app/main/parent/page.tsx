import AddChildModal from "@/components/child/AddChildModal";
import ChildList from "@/components/child/ChildList";
import AddTodoModal from "@/components/todo/AddTodoModal";
import TodoList from "@/components/todo/TodoList";

export default function ParentPage() {
  return (
    <>
      <div className="mx-auto">
        <section className="mb-10">
          <h2 className="text-center text-3xl mb-8">こどもユーザー</h2>
          <div className="mt-5">
            <AddChildModal />
          </div>
          <div className="mt-5">
            <ChildList />
          </div>
        </section>

        <section className="mt-20">
          <h2 className="text-center text-3xl mb-8">やること</h2>
          <div className="mt-5">
            <AddTodoModal />
          </div>
          <div className="mt-5">
            <TodoList />
          </div>
        </section>
      </div>
    </>
  );
}
