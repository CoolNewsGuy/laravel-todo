import DangerButton from "@/Components/DangerButton";
import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import Todo from "@/Components/TodoCard";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { PageProps, Todo as TodoType } from "@/types";
import { Head, Link, useForm } from "@inertiajs/react";
import { Plus } from "lucide-react";

export default function Todos({ todos }: PageProps<{ todos: TodoType[] }>) {
  const { data, setData, errors, processing, post, reset } = useForm({
    title: "",
  });

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    post(route("todos.store"), {
      onSuccess: () => {
        reset();
      },
    });
  }

  return (
    <AuthenticatedLayout>
      <Head title="Todos" />

      <form
        className="mt-10 flex items-start justify-center gap-3"
        onSubmit={onSubmit}
      >
        <div className="flex flex-col gap-2 w-[max(40%,280px)]">
          <TextInput
            className=""
            placeholder="Add a todo..."
            value={data.title}
            onChange={(e) => setData("title", e.target.value)}
          />
          <InputError message={errors.title} />
        </div>

        <PrimaryButton
          className="dark:bg-indigo-800 hover:dark:bg-indigo-900 active:dark:bg-current focus:dark:bg-current"
          aria-label="Add todo"
          disabled={processing}
        >
          <Plus className="stroke-white" />
        </PrimaryButton>
      </form>

      <div className="flex flex-col items-center mt-14 gap-3">
        <div className="w-[max(40%,529px)] max-[555px]:w-[90%]">
          <DeleteAllButton />
        </div>

        {todos.map((todo) => (
          <Todo key={todo.id} todo={todo} />
        ))}
      </div>
    </AuthenticatedLayout>
  );
}

function DeleteAllButton() {
  return (
    <Link as="div" href={"/delete-all-todos"} method="delete">
      <DangerButton className="border-2 border-red-800">
        delete all
      </DangerButton>
    </Link>
  );
}
