import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type Todo } from "@/types";
import { Dot } from "lucide-react";
import Dropdown from "./Dropdown";

export default function Todo({ todo }: { todo: Todo }) {
  return (
    <Card className="w-[40%] rounded-xl flex justify-between items-center">
      <div>
        <CardHeader>
          <CardTitle>{todo.title}</CardTitle>
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
            <Dropdown.Link
              href={route("todos.destroy", todo.id)}
              method="delete"
            >
              Delete
            </Dropdown.Link>
          </Dropdown.Content>
        </Dropdown>
      </CardFooter>
    </Card>
  );
}
