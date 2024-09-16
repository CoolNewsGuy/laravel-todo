import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { Plus } from "lucide-react";

export default function Todos() {
  const { data, setData, errors, processing, post } = useForm({
    title: "",
  });

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    post(route("todos.store"), { onSuccess: () => alert("Added a new todo!") });
  }

  return (
    <AuthenticatedLayout>
      <Head title="Todos" />

      <form
        className="mt-10 flex items-start justify-center gap-3"
        onSubmit={onSubmit}
      >
        <div className="flex flex-col gap-2 w-[40%]">
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
    </AuthenticatedLayout>
  );
}
