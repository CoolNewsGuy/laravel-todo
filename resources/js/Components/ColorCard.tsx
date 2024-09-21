import { Button } from "@/components/ui/button";
import { useNotification } from "@/hooks/use-notification";
import { cn, getTheFullHexColorForm } from "@/lib/utils";
import { Color } from "@/types";
import { router } from "@inertiajs/react";
import { Check, Copy, Heart, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

interface ColorCardProps {
  color: Color;
  className?: string;
}

export default function ColorCard({ color, className }: ColorCardProps) {
  const [copied, setCopied] = useState(false);
  let colorNameUpperCased = useMemo(
    () => getTheFullHexColorForm(color.color)!.toUpperCase(),
    [color.color],
  );
  const notification = useNotification();

  async function copyColorToClipboard() {
    await navigator.clipboard.writeText(colorNameUpperCased);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 500);
  }

  function addToFavorite(e: React.MouseEvent) {
    e.stopPropagation();

    router.patch(
      route("colors.update", color.id),
      {},
      {
        onSuccess() {
          notification.show({
            message: !color.is_favorite
              ? "Added color to favorites!"
              : "Removed color from favorites!",
            state: "success",
          });
        },
        onError() {
          notification.show({
            message: !color.is_favorite
              ? "Couldn't add color to favorites!"
              : "Couldn't remove color from favorites",
            state: "error",
          });
        },
      },
    );
  }

  function removeColor(e: React.MouseEvent) {
    e.stopPropagation();

    router.delete(route("colors.destroy", color.id), {
      onSuccess() {
        notification.show({
          message: "Deleted color successfully!",
          state: "success",
        });
      },

      onError() {
        notification.show({
          message: "Couldn't delete color! Please try again.",
          state: "error",
        });
      },
    });
  }

  return (
    <div
      className={cn(
        "cursor-pointer overflow-hidden rounded-md shadow-md transition-transform hover:scale-105",
        className,
      )}
      title="Copy color"
      onDoubleClick={addToFavorite}
      onClick={copyColorToClipboard}
    >
      <div
        className="relative h-[13rem]"
        style={{ backgroundColor: color.color }}
      >
        <Button
          className={cn(
            "absolute right-4 top-4 size-[2.1rem] border border-gray-400 bg-white transition-colors hover:bg-white/90",
            copied && "border-transparent bg-green-400 hover:bg-green-400",
          )}
          size={"icon"}
          onClick={copyColorToClipboard}
          aria-label={"Copy color to clipboard"}
          title={"Copy color"}
        >
          {copied ? (
            <Check className="stroke-white" size={20} />
          ) : (
            <Copy className="stroke-black" size={17} />
          )}
        </Button>
        <Button
          className={cn(
            "absolute right-4 top-14 size-[2.1rem] border border-gray-400 bg-white text-black transition-colors hover:border-red-400 hover:bg-red-50 hover:text-red-400",
            color.is_favorite && "border-transparent bg-red-200 text-red-500",
          )}
          size={"icon"}
          aria-label={"Add to favorite"}
          title={"Add to favorite"}
          onClick={addToFavorite}
        >
          <Heart
            className={cn(color.is_favorite && "fill-red-500")}
            size={20}
          />
        </Button>
        <Button
          className={cn(
            "absolute right-4 top-24 size-[2.1rem] bg-red-600 text-white transition-colors hover:bg-red-700 active:bg-red-800",
          )}
          size={"icon"}
          aria-label={"Remove color"}
          title={"Remove color"}
          onClick={removeColor}
        >
          <Trash2 size={20} />
        </Button>
      </div>

      <div className="flex justify-center rounded-b-md border p-3 text-lg uppercase dark:border-gray-700 dark:bg-gray-800">
        {colorNameUpperCased}
      </div>
    </div>
  );
}
