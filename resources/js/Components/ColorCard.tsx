import { Button } from "@/components/ui/button";
import { useNotification } from "@/hooks/use-notification";
import { cn, getTheFullHexColorForm } from "@/lib/utils";
import { Color } from "@/types";
import { router } from "@inertiajs/react";
import { Check, Copy, Heart, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import TooltipWrapper from "./TooltipWrapper";

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
  const [showBigHeart, setShowBigHeart] = useState(false);
  const [addedToFavorite, setAddedToFavorite] = useState(color.is_favorite);

  async function copyColorToClipboard() {
    await navigator.clipboard.writeText(colorNameUpperCased);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 500);
  }

  function addToFavorite(e: React.MouseEvent) {
    e.stopPropagation();

    // check that we're adding to favorites
    if (!color.is_favorite) {
      setShowBigHeart(true);
      setAddedToFavorite(true);

      setTimeout(() => {
        setShowBigHeart(false);
      }, 600);
    } else {
      setAddedToFavorite(false);
    }

    router.patch(
      route("colors.update", color.id),
      {},
      {
        preserveScroll: true,

        onSuccess() {
          setAddedToFavorite(!color.is_favorite);

          notification.show({
            message: !color.is_favorite
              ? "Added color to favorites!"
              : "Removed color from favorites!",
            state: "success",
          });
        },
        onError() {
          setAddedToFavorite(color.is_favorite);

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
      preserveScroll: true,

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
    <TooltipWrapper content="Copy color">
      <div
        className={cn(
          "cursor-pointer rounded-md shadow-md transition-transform hover:scale-105",
          className,
        )}
        onDoubleClick={addToFavorite}
        onClick={copyColorToClipboard}
      >
        <div
          className="relative h-[13rem] rounded-t-md"
          style={{
            backgroundColor: color.color,
            boxShadow: `0 0 12px ${color.color}`,
          }}
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
              "absolute right-4 top-14 size-[2.1rem] border border-gray-400 bg-white text-black transition-colors duration-75 hover:border-red-400 hover:bg-red-50 hover:text-red-400",
              addedToFavorite && "border-transparent bg-red-200 text-red-500",
            )}
            size={"icon"}
            aria-label={"Add to favorite"}
            title={"Add to favorite"}
            onClick={addToFavorite}
          >
            <Heart
              className={cn(addedToFavorite && "fill-red-500")}
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
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Heart
              size={100}
              className={cn(
                "scale-0 fill-red-500 stroke-red-300 stroke-1 drop-shadow-lg transition-transform",
                showBigHeart && "scale-100",
              )}
            />
          </div>
        </div>
        <div className="flex justify-center rounded-b-md border p-3 text-lg uppercase dark:border-gray-700 dark:bg-gray-800">
          {colorNameUpperCased}
        </div>
      </div>
    </TooltipWrapper>
  );
}
