import { Button } from "@/components/ui/button";
import { useNotification } from "@/hooks/use-notification";
import { cn, getTheFullHexColorForm } from "@/lib/utils";
import { Color } from "@/types";
import { router, usePage } from "@inertiajs/react";
import { Check, Copy, Heart, MessageCircle, Trash2 } from "lucide-react";
import { createContext, useMemo, useState } from "react";
import TooltipWrapper from "./TooltipWrapper";
import CommentsSection from "./CommentsSection";
import { useActiveCardContext } from "@/contexts/active-card-context";

interface ColorCardProps {
  color: Color;
  className?: string;
}

export const ColorContext = createContext<Color | null>(null);

export default function ColorCard({ color, className }: ColorCardProps) {
  const [copied, setCopied] = useState(false);
  const colorNameUpperCased = useMemo(
    () => getTheFullHexColorForm(color.color)!.toUpperCase(),
    [color.color],
  );
  const notification = useNotification();
  const [shouldShowBigHeart, setShouldShowBigHeart] = useState(false);
  const [addedToFavorite, setAddedToFavorite] = useState(color.is_favorite);
  const [showComments, setShowComments] = useState(false);
  const activeCard = useActiveCardContext();
  const { auth } = usePage().props;

  async function copyColorToClipboard() {
    await navigator.clipboard.writeText(colorNameUpperCased);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 500);
  }

  function showBigHeart() {
    setShouldShowBigHeart(true);

    setTimeout(() => {
      setShouldShowBigHeart(false);
    }, 600);
  }

  function addToFavorite(e: React.MouseEvent) {
    e.stopPropagation();

    // check that we're adding to favorites
    if (!color.is_favorite) {
      showBigHeart();
      setAddedToFavorite(true);
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
    <div
      className={cn(
        "relative rounded-md shadow-md transition-transform",
        showComments && "z-10 scale-105",
      )}
    >
      <TooltipWrapper content="Copy color">
        <div
          className={cn("cursor-pointer", className)}
          onClick={copyColorToClipboard}
        >
          <div
            className="relative h-[13rem] select-none rounded-t-md"
            style={{
              backgroundColor: color.color,
              boxShadow: `0 0 12px ${color.color}`,
            }}
            onDoubleClick={
              auth.user.id === color.user_id ? addToFavorite : showBigHeart
            }
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

            <div
              className={cn(
                "contents",
                auth.user.id !== color.user_id && "hidden",
              )}
            >
              <Button
                className={cn(
                  "absolute right-4 top-14 size-[2.1rem] border border-gray-400 bg-white text-black transition-colors duration-75 hover:border-red-400 hover:bg-red-50 hover:text-red-400",
                  addedToFavorite &&
                    "border-transparent bg-red-200 text-red-500",
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
            </div>

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <Heart
                size={100}
                className={cn(
                  "scale-0 fill-red-500 stroke-red-300 stroke-1 drop-shadow-lg transition-transform",
                  shouldShowBigHeart && "scale-100",
                )}
              />
            </div>
          </div>
          <div
            className={cn(
              "relative flex justify-center border p-3 text-lg dark:border-gray-700 dark:bg-gray-800",
              !showComments && "rounded-b-md",
            )}
          >
            <TooltipWrapper content="Comments">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <button
                  className="flex items-center gap-1"
                  onClick={(e) => {
                    e.stopPropagation();

                    setShowComments(!showComments);
                  }}
                >
                  <MessageCircle size={20} />
                  <span>{color.comments.length ?? "2"}</span>
                </button>
              </div>
            </TooltipWrapper>

            {colorNameUpperCased}
          </div>
        </div>
      </TooltipWrapper>

      <ColorContext.Provider value={color}>
        <div className="absolute z-[1] w-full">
          {showComments && <CommentsSection />}
        </div>
      </ColorContext.Provider>
    </div>
  );
}
