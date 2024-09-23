import { Dices, Plus } from "lucide-react";
import PrimaryButton from "./PrimaryButton";
import TextInput from "./TextInput";
import { useForm } from "@inertiajs/react";
import InputError from "./InputError";
import {
  cn,
  containsOnlyHexDigits,
  generateRandomHexColor,
  getTheFullHexColorForm,
} from "@/lib/utils";
import { useEffect, useState } from "react";
import { useNotification } from "@/hooks/use-notification";
import TooltipWrapper from "./TooltipWrapper";
import SecondaryButton from "./SecondaryButton";

export default function NewColorForm() {
  const { data, setData, processing, post, reset, errors } = useForm({
    red: "",
    green: "",
    blue: "",
  });
  const color = `#${data.red}${data.green}${data.blue}` as const;
  const invalidDigitError = !containsOnlyHexDigits(color.slice(1));
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
      preserveScroll: true,
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

  function getRandomColor() {
    const randomColor = generateRandomHexColor().slice(1);
    setData({
      red: randomColor[0] + randomColor[1],
      green: randomColor[2] + randomColor[3],
      blue: randomColor[4] + randomColor[5],
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
    <form onSubmit={onSubmit} className="w-[235px]">
      <div className="flex flex-col gap-3">
        <div className="flex items-end gap-2">
          <RandomColorButton onClick={getRandomColor} />

          {(["red", "green", "blue"] as const).map((channel) => (
            <div className="flex flex-col items-center gap-2" key={channel}>
              <label
                htmlFor={channel}
                className="text-lg text-muted-foreground"
              >
                {channel[0].toUpperCase()}
              </label>
              <TextInput
                id={channel}
                className="size-[3.3rem] p-3 text-center text-lg uppercase"
                maxLength={2}
                value={data[channel]}
                onChange={(e) => {
                  setData(channel, e.target.value.toUpperCase());
                }}
                isFocused={!!errors[channel]}
              />
            </div>
          ))}
        </div>

        <div
          className={cn(
            "space-y-1",
            !invalidDigitError && !lengthError && "hidden",
          )}
        >
          {invalidDigitError && (
            <InputError message="Invalid hex digits." className="font-bold" />
          )}

          {lengthError && (
            <InputError
              message="All fields must be either of length 1 or 2."
              className={cn("font-bold leading-4")}
            />
          )}
        </div>

        <ColorPreviewBox color={color} />

        <PrimaryButton
          className="h-[3.3rem] place-content-center !text-base capitalize tracking-wide dark:bg-indigo-800 dark:text-white dark:hover:!bg-indigo-900 dark:focus:!bg-indigo-900 dark:active:bg-indigo-900"
          disabled={processing}
        >
          Add color
        </PrimaryButton>
      </div>
    </form>
  );
}

function ColorPreviewBox({ color }: { color: string }) {
  return (
    <TooltipWrapper content="Color preview">
      <div
        className={cn(
          "size-[235px] rounded-md border-2 border-indigo-800",
          getTheFullHexColorForm(color) && "border-none",
        )}
        style={{
          backgroundColor: color,
          boxShadow: `0 0 12px ${color}`,
        }}
      ></div>
    </TooltipWrapper>
  );
}

function RandomColorButton({
  onClick,
}: {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <TooltipWrapper content="Generate a random color">
      <div className="grid size-[3.3rem] place-content-center rounded-full">
        <SecondaryButton
          type="button"
          className="grid size-[2.8rem] place-content-center !rounded-full transition-transform hover:rotate-180"
          aria-label="Generate random color"
          onClick={onClick}
        >
          <Dices size={22} />
        </SecondaryButton>
      </div>
    </TooltipWrapper>
  );
}
