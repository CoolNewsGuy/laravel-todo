import { Plus } from "lucide-react";
import PrimaryButton from "./PrimaryButton";
import TextInput from "./TextInput";
import { useForm } from "@inertiajs/react";
import InputError from "./InputError";
import { containsOnlyHexDigits } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useNotification } from "@/hooks/use-notification";

export default function NewColorForm() {
  const { data, setData, processing, post, reset, errors } = useForm({
    red: "",
    green: "",
    blue: "",
  });
  const [lengthError, setLengthError] = useState(false);
  const notification = useNotification();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (
      Object.values(data).some((value) => value.length === 0) ||
      (Object.values(data).some((value) => value.length === 1) &&
        Object.values(data).some((value) => value.length === 2))
    ) {
      setLengthError(true);

      return;
    }

    post(route("colors.store"), {
      onSuccess() {
        reset();
        notification.show({
          message: "Created color successfully!",
          state: "success",
        });
      },

      onError() {
        notification.show({
          message: "Couldn't create color!",
          state: "error",
        });
      },
    });
  }

  useEffect(() => {
    const values = Object.values(data);

    if (
      values.every((value) => value.length === 0) ||
      values.every((value) => value.length === 1) ||
      values.every((value) => value.length === 2)
    ) {
      setLengthError(false);
    }
  }, [data]);

  return (
    <form className="flex items-center gap-4" onSubmit={onSubmit}>
      <div>
        <div className="flex gap-2">
          {(["red", "green", "blue"] as const).map((color) => (
            <div className="flex flex-col items-center gap-2" key={color}>
              <label htmlFor={color} className="text-lg text-muted-foreground">
                {color[0].toUpperCase()}
              </label>
              <TextInput
                id={color}
                className="size-[3.3rem] p-3 uppercase text-lg text-center"
                maxLength={2}
                value={data[color]}
                onChange={(e) => {
                  setData(color, e.target.value.toUpperCase());
                }}
                isFocused={!!errors[color]}
              />
            </div>
          ))}

          <div className="flex flex-col items-center gap-2 ml-2">
            <label className="text-lg invisible">s</label>
            <PrimaryButton
              className="size-[3.3rem] dark:bg-indigo-800 dark:text-white dark:hover:!bg-indigo-900 dark:active:bg-indigo-900 dark:focus:!bg-indigo-900"
              disabled={processing}
            >
              <Plus />
            </PrimaryButton>
          </div>
        </div>

        {!containsOnlyHexDigits(`${data.red}${data.green}${data.blue}`) && (
          <InputError
            message="Invalid hex digits."
            className="mt-2 text-[0.9rem] font-bold"
          />
        )}

        {lengthError && (
          <InputError
            message="All fields must be either of length 1 or 2."
            className="text-[0.9rem] font-bold"
          />
        )}
      </div>
    </form>
  );
}
