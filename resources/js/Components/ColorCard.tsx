import { Button } from "@/components/ui/button";
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
    [color.color]
  );

  async function copyColorToClipboard() {
    await navigator.clipboard.writeText(colorNameUpperCased);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 500);
  }

  function addToFavorite(e: React.MouseEvent) {
    e.stopPropagation();

    router.patch(route("colors.update", color.id));
  }

  function removeColor() {
    router.delete(route("colors.destroy", color.id));
  }

  return (
    <div
      className={cn(
        "rounded-md overflow-hidden transition-transform shadow-md cursor-pointer hover:scale-105",
        className
      )}
      title="Copy color"
      onDoubleClick={addToFavorite}
      onClick={copyColorToClipboard}
    >
      <div
        className="h-[13rem] relative"
        style={{ backgroundColor: color.color }}
      >
        <Button
          className={cn(
            "absolute right-4 top-4 size-[2.1rem] border-gray-400 border bg-white hover:bg-white/90 transition-colors",
            copied && "bg-green-400 border-transparent hover:bg-green-400"
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
            "absolute right-4 top-14 size-[2.1rem] border-gray-400 border bg-white text-black hover:bg-red-50 hover:border-red-400 hover:text-red-400 transition-colors",
            color.is_favorite && "bg-red-200 text-red-500 border-transparent"
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
            "absolute right-4 top-24 size-[2.1rem] bg-red-600 text-white hover:bg-red-700 active:bg-red-800 transition-colors"
          )}
          size={"icon"}
          aria-label={"Remove color"}
          title={"Remove color"}
          onClick={removeColor}
        >
          <Trash2 size={20} />
        </Button>
      </div>

      <div className="flex justify-center text-lg uppercase p-3 border dark:bg-gray-800 dark:border-gray-700 rounded-b-md">
        {colorNameUpperCased}
      </div>
    </div>
  );
}
