import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type Todo } from "@/types";
import { Dot, LogOut, Save } from "lucide-react";
import Dropdown from "./Dropdown";
import { useState } from "react";
import TextInput from "./TextInput";
import PrimaryButton from "./PrimaryButton";
import { useForm } from "@inertiajs/react";
import InputError from "./InputError";

export default function Todo({ todo }: { todo: Todo }) {
  const [editing, setEditing] = useState(false);

  return (
    <Card className="w-[max(40%,529px)] rounded-xl flex justify-between items-center border-2">
      <div>
        <CardHeader>
          <CardTitle>
            {editing ? (
              <EditForm todo={todo} setEditing={setEditing} />
            ) : (
              todo.title
            )}
          </CardTitle>
        </CardHeader>

        <CardContent className="text-muted-foreground">
          {new Date(todo.created_at).toLocaleString()}
        </CardContent>
      </div>

      <CardFooter className="py-0">
        <Dropdown>
          <Dropdown.Trigger>
            <button
              className="flex flex-col items-center justify-center gap-0 size-10 rounded-full outline-1
                         hover:bg-muted/50 hover:outline hover:outline-gray-700
                         focus-within:bg-muted/50 focus-within:outline focus-within:outline-gray-700"
            >
              {[...Array(3)].map((_, i) => (
                <Dot key={i} size={8} className="stroke-[5]" />
              ))}
            </button>
          </Dropdown.Trigger>

          <Dropdown.Content>
            <Dropdown.Item
              onClick={() => setEditing(true)}
              className="cursor-pointer"
            >
              Edit
            </Dropdown.Item>
            <Dropdown.Link
              href={route("todos.destroy", todo.id)}
              method="delete"
              as="button"
            >
              Delete
            </Dropdown.Link>
          </Dropdown.Content>
        </Dropdown>
      </CardFooter>
    </Card>
  );
}

function EditForm({
  todo,
  setEditing,
}: {
  todo: Todo;
  setEditing: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { setData, errors, patch, processing } = useForm({
    title: todo.title,
  });

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    patch(route("todos.update", todo.id), {
      onSuccess: () => {
        setEditing(false);

        alert("Updated todo!");
      },
    });
  }

  return (
    <form className="flex gap-2" onSubmit={onSubmit}>
      <div>
        <TextInput
          defaultValue={todo.title}
          placeholder="Enter new tood..."
          onChange={(e) => setData("title", e.target.value)}
        />
        <InputError message={errors.title} />
      </div>

      <PrimaryButton
        className="dark:bg-indigo-800 hover:dark:bg-indigo-900 active:dark:bg-indigo-900 focus:dark:bg-indigo-900"
        aria-label="Save edit"
        disabled={processing}
      >
        <Save className="stroke-white" />
      </PrimaryButton>

      <PrimaryButton
        type="button"
        className="dark:bg-gray-800 hover:dark:bg-indigo-900 active:dark:bg-indigo-900 focus:dark:bg-indigo-900"
        aria-label="Exit editing mode"
        onClick={() => setEditing(false)}
        disabled={processing}
      >
        <LogOut className="stroke-white" />
      </PrimaryButton>
    </form>
  );
}
