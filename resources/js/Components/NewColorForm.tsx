import { Plus, Repeat } from "lucide-react";
import PrimaryButton from "./PrimaryButton";
import TextInput from "./TextInput";
import { useForm } from "@inertiajs/react";
import InputError from "./InputError";
import { cn, containsOnlyHexDigits, generateRandomHexColor } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useNotification } from "@/hooks/use-notification";
import { useScrollSaver } from "@/hooks/use-scroll-saver";
import TooltipWrapper from "./TooltipWrapper";
import SecondaryButton from "./SecondaryButton";

export default function NewColorForm() {
  const { data, setData, processing, post, reset, errors } = useForm({
    red: "",
    green: "",
    blue: "",
  });
  const [lengthError, setLengthError] = useState(false);
  const notification = useNotification();
  const scrollSaver = useScrollSaver();

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

    scrollSaver.saveCurrentPosition();

    post(route("colors.store"), {
      onFinish() {
        scrollSaver.scrollToSavedPosition();
      },

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
    <form onSubmit={onSubmit}>
      <div className="flex items-end gap-2">
        <TooltipWrapper content="Generate a random color">
          <div className="grid size-[3.3rem] place-content-center rounded-full">
            <SecondaryButton
              type="button"
              className="grid size-[2.8rem] place-content-center !rounded-full transition-transform hover:rotate-180"
              aria-label="Generate random color"
              onClick={() => {
                const randomColor = generateRandomHexColor().slice(1);
                setData({
                  red: randomColor[0] + randomColor[1],
                  green: randomColor[2] + randomColor[3],
                  blue: randomColor[4] + randomColor[5],
                });
              }}
            >
              <Repeat size={17} />
            </SecondaryButton>
          </div>
        </TooltipWrapper>

        {(["red", "green", "blue"] as const).map((color) => (
          <div className="flex flex-col items-center gap-2" key={color}>
            <label htmlFor={color} className="text-lg text-muted-foreground">
              {color[0].toUpperCase()}
            </label>
            <TextInput
              id={color}
              className="size-[3.3rem] p-3 text-center text-lg uppercase"
              maxLength={2}
              value={data[color]}
              onChange={(e) => {
                setData(color, e.target.value.toUpperCase());
              }}
              isFocused={!!errors[color]}
            />
          </div>
        ))}

        <div className="ml-2 flex flex-col items-center gap-2">
          <label className="invisible text-lg">s</label>
          <PrimaryButton
            className="size-[3.3rem] dark:bg-indigo-800 dark:text-white dark:hover:!bg-indigo-900 dark:focus:!bg-indigo-900 dark:active:bg-indigo-900"
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
          className={cn(
            "text-[0.9rem] font-bold",
            containsOnlyHexDigits(`${data.red}${data.green}${data.blue}`) &&
              "mt-2",
          )}
        />
      )}
    </form>
  );
}
